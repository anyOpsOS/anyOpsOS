import { Injectable } from '@angular/core';

import { AnyOpsOSLibLoggerService } from '@anyopsos/lib-logger';
import { v4 as uuidv4 } from 'uuid';

import { AnyOpsOSLibNodeNetappSoapApiService, AnyOpsOSLibNodeNetappSoapApiHelpersService, AnyOpsOSLibNodeNetappFileSystemService } from '@anyopsos/lib-node-netapp';
import { AnyOpsOSLibNodeVmwareSoapApiService, AnyOpsOSLibNodeVmwareSoapApiHelpersService } from '@anyopsos/lib-node-vmware';
import { VMWareFirewallRule } from '@anyopsos/module-node-vmware';

import { MountVolumeSnapshot } from '../types/mount-volume-snapshot';
import { RestoreVolumeFiles } from '../types/restore-volume-files';
import { RestoreVmGuestFiles } from '../types/restore-vm-guest-files';
import { VmInstantRecovery } from '../types/vm-instant-recovery';
import { RestoreVm } from '../types/restore-vm';
import { BackupVm } from '../types/backup-vm';
import { BackendResponse } from '@anyopsos/backend-core/app/types/backend-response';
import { AnyOpsOSFile } from '@anyopsos/backend-core/app/types/anyopsos-file';

@Injectable({
  providedIn: 'root'
})
export class AnyOpsOSAppBackupsManagerHelpersService {

  constructor(private readonly logger: AnyOpsOSLibLoggerService,
              private readonly LibNodeNetappSoapApiService: AnyOpsOSLibNodeNetappSoapApiService,
              private readonly LibNodeNetappSoapApiHelpersService: AnyOpsOSLibNodeNetappSoapApiHelpersService,
              private readonly LibNodeNetappFileSystemService: AnyOpsOSLibNodeNetappFileSystemService,
              private readonly LibNodeVmwareSoapApiService: AnyOpsOSLibNodeVmwareSoapApiService,
              private readonly LibNodeVmwareSoapApiHelpersService: AnyOpsOSLibNodeVmwareSoapApiHelpersService) {

  }

  private restores = [];
  private backups = [];

  setRestore(restoreUuid, data) {
    this.restores[restoreUuid] = data;
  }

  setRestoreState(restoreUuid, data) {
    this.restores[restoreUuid].state.push(data);
  }

  setBackup(backupUuid, data) {
    this.backups[backupUuid] = data;
  }

  setBackupState(backupUuid, data) {
    this.backups[backupUuid].state.push(data);
  }

  /**
   * Main functions
   */
  mountRestoreSnapshotDatastore(data: MountVolumeSnapshot) {
    // Check for available licenses
    return this.checkLicenses(data).then((res) => {
      if (res instanceof Error) throw new Error('Failed to check licenses');

      // Create Volume Clone
      return this.cloneVolumeFromSnapshot(data);
    }).then((res) => {
      if (res instanceof Error) throw new Error('Failed to clone volume from snapshot');

      // Mount Volume
      return this.mountVolumeToESXi(data);

    }).then((res) => {
      if (res instanceof Error) throw new Error('Failed to mount cloned volume from snapshot to ESXi host');

    }).catch((e) => {
      console.log(e);
      return e;
    });
  }

  restoreSnapshotDatastoreFiles(data: RestoreVolumeFiles) {
    // Check for available licenses
    return this.checkLicenses(data).then((res) => {
      if (res instanceof Error) throw new Error('Failed to check licenses');

      // Create Volume Clone
      return this.cloneVolumeFromSnapshot(data);
    }).then((res) => {
      if (res instanceof Error) throw new Error('Failed to clone volume from snapshot');

      // Mount Volume
      return this.mountVolumeToESXi(data);

    }).then((res) => {
      if (res instanceof Error) throw new Error('Failed to mount cloned volume from snapshot to ESXi host');

      // Return new Datastore for further use
      return res;

    }).catch((e) => {
      console.log(e);
      return e;
    });
  }

  restoreSnapshotVMGuestFiles(data: RestoreVmGuestFiles) {
    // Check for available licenses
    return this.checkLicenses(data).then((res) => {
      if (res instanceof Error) throw new Error('Failed to check licenses');

      // Create Volume Clone
      return this.cloneVolumeFromSnapshot(data);
    }).then((res) => {
      if (res instanceof Error) throw new Error('Failed to clone volume from snapshot');

      // Mount Volume
      return this.mountVolumeToESXi(data);

    }).then((res) => {
      if (res instanceof Error) throw new Error('Failed to mount cloned volume from snapshot to ESXi host');

      return this.registerVM(data, res);

    }).then((res) => {
      if (res.status === 'error') throw new Error('Failed to register VM to vCenter');
      return res;


    }).catch((e) => {
      return e;
    });
  }

  restoreSnapshotIntoInstantVM(data: VmInstantRecovery) {
    const loggerArgs = arguments;

    // Check for available licenses
    return this.checkLicenses(data).then((res) => {
      if (res instanceof Error) throw new Error('Failed to check licenses');

      // Create Volume Clone
      return this.cloneVolumeFromSnapshot(data);
    }).then((res) => {
      if (res instanceof Error) throw new Error('Failed to clone volume from snapshot');

      // Mount Volume
      return this.mountVolumeToESXi(data);

    }).then((res) => {
      if (res instanceof Error) throw new Error('Failed to mount cloned volume from snapshot to ESXi host');

      return this.registerVM(data, res);

    }).then((res) => {
      if (res instanceof Error) throw new Error('Failed to register VM from snapshot to ESXi host');

      if (data.powerOnVm) {
        // Power On VM
        this.logger.debug('Backups Manager', 'Powering on vm', loggerArgs);

        // @ts-ignore TODO
        return this.LibNodeVmwareSoapApiService.callSoapApi(data.virtual.uuid, 'PowerOnVM_Task', {
          _this: {
            $type: 'VirtualMachine',
            _value: data.vm.info.obj.name
          },
          host: {
            $type: 'HostSystem',
            _value: data.host.info.obj.name
          }
        });
      }

      return res;

    }).then((res) => {
      if (res && res.status === 'error') throw new Error('Failed to power on VM on vCenter');

      return res;

    }).catch((e) => {
      console.log(e);
      return e;
    });
  }

  restoreSnapshotIntoVM(data: RestoreVm) {
    const loggerArgs = arguments;

    // TODO: if new location
    /*return cloneVMFromSnapshot(data).then((data) => {

     });*/

    // Restore to current location (override VM)
    return this.restoreVMfromSnapshotToCurrentLocation(data).then(() => {

      if (data.powerOnVm) {
        // Power On VM
        this.logger.debug('Backups Manager', 'Powering on vm', loggerArgs);

        return this.LibNodeVmwareSoapApiService.callSoapApi(data.virtual.uuid, 'PowerOnVM_Task', {
          _this: {
            $type: 'VirtualMachine',
            _value: data.vm.info.obj.name
          },
          host: {
            $type: 'HostSystem',
            _value: data.host.info.obj.name
          }
        });
      }

    }).then((res) => {
      if (res instanceof Error) throw new Error('Failed to restore VM snapshot to current location');

    }).catch((e) => {
      console.log(e);
      return e;
    });
  }

  startVMBackup(data: BackupVm) {
    return Promise.resolve(data);
    /*var relationships = {};
    var main_promises = [];
    var datastore_promises = [];
    var ss_promises = [];
    var ssr_promises = [];

    this.connections = connectionsFactory.connections();

    if (data.backupNow !== true) return; //TODO: set schedule

    if (data.selectedPrimaryStorage !== 'snapshot') return;

    // Start backup

    this.logger.debug('Backups Manager', 'Running backup now', `uuid [${data.uuid}], name [${data.backupName}]`);

    // Get all relationships
    angular.forEach(data.selectedObjects, (object) => {

      if (object.type === 'Datastore') {
        var connection = connectionsFactory.getConnectionByUuid(object.parent);
        var datastore_data = $filter('filter')(connection.datastores, {
          obj: {
            name: object.id
          }
        })[0];

        angular.forEach(datastore_data.vm.ManagedObjectReference, (vm) => {
          var vm_data = $filter('filter')(connection.vms, {
            obj: {
              name: vm.name
            }
          })[0];

          // TODO: VM with more than 1 datastore
          if (Array.isArray(vm_data.datastore.ManagedObjectReference)) return;

          // Create a VM --> Datastor --> vCenter relationship
          if (!relationships[object.parent]) relationships[object.parent] = {};
          if (!relationships[object.parent][vm_data.datastore.ManagedObjectReference.name]) relationships[object.parent][vm_data.datastore.ManagedObjectReference.name] = [];

          relationships[object.parent][vm_data.datastore.ManagedObjectReference.name].push({
            vm: vm_data.obj.name,
            state: vm_data.runtime.powerState,
            type: 'VirtualMachine'
          });
        });
      }

      if (object.type === 'VirtualMachine') {

        // TODO: remove VMs in previous selected objects

        // TODO: VM with more than 1 datastore
        if (Array.isArray(object.object.datastore.ManagedObjectReference)) return;

        // Create a VM --> Datastor --> vCenter relationship
        if (!relationships[object.parent]) relationships[object.parent] = {};
        if (!relationships[object.parent][object.object.datastore.ManagedObjectReference.name]) relationships[object.parent][object.object.datastore.ManagedObjectReference.name] = [];

        relationships[object.parent][object.object.datastore.ManagedObjectReference.name].push({
          vm: object.id,
          state: object.object.runtime.powerState,
          type: 'VirtualMachine'
        });

      }
    });

    console.log(relationships);

    // For each vCenter
    angular.forEach(relationships, (datastores, vCenter) => {

      var connection = connectionsFactory.getConnectionByUuid(vCenter);
      var esxi_credential = connection.credential;
      var esxi_address = connection.host;
      var esxi_port = connection.port;
      var task_id;

      this.logger.debug('Backups Manager [%s] -> Connecting to vCenter -> vCenter [%s]', data.uuid, esxi_address);
      main_promises.push(this.VMWare.connectvCenterSoap(esxi_credential, esxi_address, esxi_port).then((res) => {
        if (res.status === 'error') throw new Error('Failed to connect to vCenter');

        return this.VMWare.createTask(esxi_credential, esxi_address, esxi_port, 'com.anyopsos.management.backup', 'Datacenter', 'group-d1');

      }).then((res) => {
        if (res.status === 'error') throw new Error('Failed to create task');
        this.logger.debug('Backups Manager [%s] -> Main task created -> vCenter [%s], task [%s]', data.uuid, esxi_address, res.data.key);

        task_id = res.data.key;

        return this.VMWare.setTaskState(esxi_credential, esxi_address, esxi_port, task_id, 'running');
      }).then((res) => {
        if (res.status === 'error') throw new Error('Failed to set task state');
        this.logger.debug('Backups Manager [%s] -> Main task running -> vCenter [%s], task [%s]', data.uuid, esxi_address, task_id);

        return this.VMWare.updateTaskProgress(esxi_credential, esxi_address, esxi_port, task_id, 20);
      }).then((res) => {
        if (res.status === 'error') throw new Error('Failed to update task progress');
        this.logger.debug('Backups Manager [%s] -> Main task 20% -> vCenter [%s], task [%s]', data.uuid, esxi_address, task_id);

        // Backup for each Datstore
        angular.forEach(datastores, (objects, datastore) => {

          var datastore_task_id;

          datastore_promises.push(this.VMWare.createTask(esxi_credential, esxi_address, esxi_port, 'com.anyopsos.management.backup', 'Datastore', datastore).then((res) => {
            if (res.status === 'error') throw new Error('Failed to create task');
            this.logger.debug('Backups Manager [%s] -> Datastore task created -> vCenter [%s], datastore [%s], task [%s]', data.uuid, esxi_address, datastore, res.data.key);

            datastore_task_id = res.data.key;

            return this.VMWare.setTaskState(esxi_credential, esxi_address, esxi_port, datastore_task_id, 'running');
          }).then((res) => {
            if (res.status === 'error') throw new Error('Failed to set task state');
            this.logger.debug('Backups Manager [%s] -> Datastore task running -> vCenter [%s], task [%s]', data.uuid, esxi_address, datastore_task_id);

            return this.VMWare.updateTaskProgress(esxi_credential, esxi_address, esxi_port, datastore_task_id, 20);
          }).then((res) => {
            if (res.status === 'error') throw new Error('Failed to update task progress');
            this.logger.debug('Backups Manager [%s] -> Datastore task 20% -> vCenter [%s], task [%s]', data.uuid, esxi_address, datastore_task_id);

            var smanagerFactory = $injector.get('smanagerFactory');
            var storage_link = smanagerFactory.getLinkByVMwareDatastore(vCenter, datastore);

            if (!storage_link) throw new Error('Unable to get Storage Link');

            var storage = connectionsFactory.getConnectionByUuid(storage_link.storage);
            var vserver = eval(connectionsFactory.getObjectByUuidMapping(storage_link.vserver)); // jshint ignore:line
            var volume = eval(connectionsFactory.getObjectByUuidMapping(storage_link.volume)); // jshint ignore:line

            if (!storage) throw new Error('Unable to get Storage object');
            if (!vserver) throw new Error('Unable to get Vserver object');
            if (!volume) throw new Error('Unable to get Volume object');

            var netapp_credential = storage.credential;
            var netapp_host = storage.host;
            var netapp_port = storage.port;
            var snapshots = [];

            angular.forEach(objects, (key) => {

              /*
               * Create VM Snapshot if vm state is poweredOn and quiesceTools checked
               */
    /*if (key.state === 'poweredOn' && data.quiesceTools) {
      this.logger.debug('Backups Manager [%s] -> Creating VM snapshot -> VM [%s]', data.uuid, key.vm);

      ss_promises.push(this.VMWare.createSnapShot(
        esxi_credential,
        esxi_address,
        esxi_port,
        key.vm,
        'anyOpsOS_backup_' + data.uuid,
        'anyOpsOS temporary snapshot. Do not delete this snapshot while a backup is running.',
        false,
        true
      ).then((res) => {
        if (res.status === 'error') throw new Error('Failed to create snapshot');
        if (res.data[0].propSet.info.error) throw new Error('Failed to create snapshot');

        this.logger.debug('Backups Manager [%s] -> VM snapshot created -> vCenter [%s], vm [%s], snapshot [%s]', data.uuid, esxi_address, key.vm, res.data[0].propSet.info.result.name);

        snapshots.push(res.data[0].propSet.info.result.name);

      }).catch((e) => {
        console.log(e);
        return e;
      }));
    } else {
      this.logger.debug('Backups Manager [%s] -> VM poweredOff, do not create snapshot -> VM [%s]', data.uuid, key.vm);
    }

  });
  //End VM each

  return Promise.all(ss_promises).then(() => {

    return this.VMWare.updateTaskProgress(esxi_credential, esxi_address, esxi_port, datastore_task_id, 40);
  }).then((res) => {
    if (res.status === 'error') throw new Error('Failed to update task progress');
    this.logger.debug('Backups Manager [%s] -> Datastore task 40% -> vCenter [%s], task [%s]', data.uuid, esxi_address, datastore_task_id);

    /*
     * Create Storage Snapshot
     */
    /*return this.NetApp.createSnapshot(netapp_credential, netapp_host, netapp_port, vserver['vserver-name'], volume['volume-id-attributes'].name, data.backupName);

  }).then((res) => {
    if (res.status === 'error') throw new Error('Failed to create Volume Snapshot');
    this.logger.debug('Backups Manager [%s] -> Storage snapshot created -> vCenter [%s],
     storage [%s], vserver [%s], volume [%s]', data.uuid, esxi_address, netapp_host, vserver['vserver-name'], volume['volume-id-attributes'].name);
    return this.VMWare.updateTaskProgress(esxi_credential, esxi_address, esxi_port, datastore_task_id, 60);
  }).then((res) => {
    if (res.status === 'error') throw new Error('Failed to update task progress');
    this.logger.debug('Backups Manager [%s] -> Datastore task 60% -> vCenter [%s], task [%s]', data.uuid, esxi_address, datastore_task_id);

    /*
     * Delete VM Snapshot
     */
    /*angular.forEach(snapshots, (snapshot) => {
      ssr_promises.push(this.VMWare.removeSnapshot(esxi_credential, esxi_address, esxi_port, snapshot, false).then((res) => {
        if (res.status === 'error') throw new Error('Failed to delete snapshot');
        this.logger.debug('Backups Manager [%s] -> VM snapshot deleted -> vCenter [%s], snapshot [%s]', data.uuid, esxi_address, snapshot);

      }).catch((e) => {
        console.log(e);
        return e;
      }));
    });
    //End Snapshots each

    return Promise.all(ssr_promises);

  }).then(() => {
    return this.VMWare.updateTaskProgress(esxi_credential, esxi_address, esxi_port, datastore_task_id, 80);
  }).then((res) => {
    if (res.status === 'error') throw new Error('Failed to update task progress');
    this.logger.debug('Backups Manager [%s] -> Datastore task 80% -> vCenter [%s], task [%s]', data.uuid, esxi_address, datastore_task_id);

    // End Task
    return this.VMWare.setTaskState(esxi_credential, esxi_address, esxi_port, datastore_task_id, 'success');

  }).then((res) => {
    if (res.status === 'error') throw new Error('Failed to set task state');
    this.logger.debug('Backups Manager [%s] -> Datastore task success -> vCenter [%s], task [%s]', data.uuid, esxi_address, datastore_task_id);

  }).catch((e) => {
    console.log(e);
    return e;
  });

}));

});
//End Datastore each

// End vCenter backup task
return Promise.all(datastore_promises).then(() => {

return this.VMWare.updateTaskProgress(esxi_credential, esxi_address, esxi_port, task_id, 80);

}).then((res) => {
if (res.status === 'error') throw new Error('Failed to update task progress');
this.logger.debug('Backups Manager [%s] -> Main task 80% -> vCenter [%s], task [%s]', data.uuid, esxi_address, task_id);

// End Task
return this.VMWare.setTaskState(esxi_credential, esxi_address, esxi_port, task_id, 'success');
}).then((res) => {
if (res.status === 'error') throw new Error('Failed to set task state');
this.logger.debug('Backups Manager [%s] -> Main task success -> vCenter [%s], task [%s]', data.uuid, esxi_address, task_id);

}).catch((e) => {
console.log(e);
return e;
});

}));
});
// End vCenter each

return Promise.all(main_promises).catch((e) => {
console.log(e);
return e;
});*/
  }

  /**
   * Helpers
   */

  /**
   * @description
   * Return the latest VM snapshot
   */
  getLastSnapshot(rootSnapshotList) {
    if (rootSnapshotList.hasOwnProperty('childSnapshotList')) return this.getLastSnapshot(rootSnapshotList.childSnapshotList);

    return rootSnapshotList;
  }

  /**
   * @description
   * Checks if NetApp storage have required licenses
   */
  checkLicenses(data: MountVolumeSnapshot | RestoreVolumeFiles | RestoreVmGuestFiles | VmInstantRecovery) {
    this.logger.debug('Backups Manager', 'Check storage licenses', arguments);

    return this.LibNodeNetappSoapApiService.callSoapApi(data.storage.uuid, 'license-v2-status-list-info', {}).then((res) => {
      if (res.status === 'error') throw new Error('Failed to get licenses');

      const flexClone = res.data.filter(obj => {
        return obj.package === 'flexclone';
      })[0].method;

      if (flexClone !== 'license') throw new Error('FlexClone license not found');

    }).catch((e) => {
      console.log(e);
      return e;
    });
  }

  /**
   * @description
   * Clones Storage Volume from Snapshot
   */
  cloneVolumeFromSnapshot(data: MountVolumeSnapshot | RestoreVolumeFiles | RestoreVmGuestFiles | VmInstantRecovery, volumeNum: number = 0) {
    const loggerArgs = arguments;

    // Set new volume name
    if (volumeNum !== 0) {
      data.volumeName = 'anyOpsOS_' + data.volume.name + '_Restore_' + volumeNum;
      data.datastorePath = 'anyOpsOS_' + data.volume.name + '_' + volumeNum;
    } else {
      data.volumeName = 'anyOpsOS_' + data.volume.name + '_Restore';
      data.datastorePath = 'anyOpsOS_' + data.volume.name;
    }

    // Create Volume Clone
    this.logger.debug('Backups Manager', 'Cloning volume from snapshot', arguments);

    return this.LibNodeNetappSoapApiService.callSoapApi(data.storage.uuid, 'volume-clone-create', {
      'parent-volume': data.volume.name,
      volume: data.volumeName,
      'space-reserve': 'none',
      'parent-snapshot': data.snapshot.name
    }).then((res) => {
      if (res.status === 'error') {

        // Error duplicated volume, try next.
        if (res.data.error.errno === '17159') throw new Error('17159');

        throw new Error('Failed to clone Volume');
      }

      this.setRestoreState(data.uuid, 'volume_cloned');
    }).then(() => {

      // Mount Volume Point
      this.logger.debug('Backups Manager', 'Mounting namespace of cloned volume', loggerArgs);

      return this.LibNodeNetappSoapApiService.callSoapApi(data.storage.uuid, 'volume-mount', {
        'activate-junction': true,
        'junction-path': '/' + data.volumeName,
        'volume-name': data.volumeName,
        'export-policy-override': false
      });
    }).then((res) => {
      if (res.status === 'error') throw new Error('Failed to mount Volume');

      this.setRestoreState(data.uuid, 'namespace_mounted');
    }).catch((e) => {

      // Error duplicated volume, try next.
      if (e.message === '17159') {
        this.logger.debug('Backups Manager', 'Cloning volume from snapshot', loggerArgs);

        return this.cloneVolumeFromSnapshot(data, ++volumeNum);
      }

      console.log(e);
      return e;
    });
  }

  /**
   * @description
   * Checks ESXI firewall rules and adds new IP if needed
   */
  checkESXiFirewallRule(firewallRulesData, ruleName: string, data: MountVolumeSnapshot | RestoreVolumeFiles | RestoreVmGuestFiles | VmInstantRecovery): Promise<any> {
    const firewallRule: VMWareFirewallRule = firewallRulesData.data.ruleset.find((rule: VMWareFirewallRule) => {
      return rule.key === ruleName;
    });

    if (!firewallRule) throw new Error(`No default rules for ${ruleName} found`);

    // IP Address already allowed by Firewall
    if (firewallRule.allowedHosts.allIp === true) return;
    if (firewallRule.allowedHosts.ipAddress && typeof firewallRule.allowedHosts.ipAddress === 'string' && firewallRule.allowedHosts.ipAddress === data.iface.info.data.address) return;
    if (firewallRule.allowedHosts.ipAddress && Array.isArray(firewallRule.allowedHosts.ipAddress) && firewallRule.allowedHosts.ipAddress.includes(data.iface.info.data.address)) return;
    // TODO check when is a network instead of an IP

    let ipsRule;

    // Create new string of ip for the firewall rule
    if (firewallRule.allowedHosts.ipAddress && typeof firewallRule.allowedHosts.ipAddress === 'string' && firewallRule.allowedHosts.ipAddress === data.iface.info.data.address) {
      ipsRule = `${firewallRule.allowedHosts.ipAddress}, ${data.iface.info.data.address}`;
    }
    if (firewallRule.allowedHosts.ipAddress && Array.isArray(firewallRule.allowedHosts.ipAddress) && firewallRule.allowedHosts.ipAddress.includes(data.iface.info.data.address)) {
      ipsRule = `${firewallRule.allowedHosts.ipAddress.join(', ')}, ${data.iface.info.data.address}`;
    }

    this.logger.debug('Backups Manager', 'Updating firewall rules', arguments);

    return this.LibNodeVmwareSoapApiHelpersService.getHostFirewallSystem(data.virtual.uuid, data.host.info.obj.name).then((firewallSystem) => {
      if (firewallSystem.status === 'error') throw new Error('Failed to get Host firewallSystem from vCenter');

      // @ts-ignore TODO
      return this.LibNodeVmwareSoapApiService.callSoapApi(data.virtual.uuid, 'UpdateRuleset', {
        _this: {
          $type: 'HostFirewallSystem',
          _value: firewallSystem.data
        },
        id: ruleName,
        spec: {
          allowedHosts: ipsRule
        }
      });
    });
  }

  /**
   * @description
   * Checks ESXI firewall rules and allows to mount a datastore
   */
  checkESXiFirewall(data: MountVolumeSnapshot | RestoreVolumeFiles | RestoreVmGuestFiles | VmInstantRecovery): Promise<any> {

    return this.LibNodeVmwareSoapApiHelpersService.getHostFirewallRules(data.virtual.uuid, data.host.info.obj.name).then((firewallRulesData) => {
      if (firewallRulesData.status === 'error') throw new Error('Failed to get Host firewall rules from vCenter');

      console.log(firewallRulesData);

      // All outgoing data is allowed. Nothing to do.
      if (firewallRulesData.data.defaultPolicy.outgoingBlocked === false) return;

      // Check if storage interface is NFS and which protocol versions are enabled
      if (data.iface.info.data['data-protocols']['data-protocol'] === 'nfs') {

        return this.LibNodeNetappSoapApiService.callSoapApi(data.storage.uuid, 'nfs-service-get', {}).then((serviceData) => {
          if (serviceData.status === 'error') throw new Error('Failed to get NFS service status from Storage');

          // NFS v4.1
          if (serviceData.data['is-nfsv41-enabled']) return this.checkESXiFirewallRule(firewallRulesData, 'nfs41Client', data);

          // NFS v3
          if (serviceData.data['is-nfsv3-enabled']) return this.checkESXiFirewallRule(firewallRulesData, 'nfsClient', data);

          throw new Error('NFS interface but not NFS (v3/4.1) protocol enabled in storage');
        });
      }

      throw new Error('Selected interface is not NFS.');

    });
  }

  /**
   * @description
   * Checks Storage volume export rules and allows to mount it into an ESXi server
   */
  checkStorageVolumeExports(data: MountVolumeSnapshot | RestoreVolumeFiles | RestoreVmGuestFiles | VmInstantRecovery): Promise<any> {
    const loggerArgs = arguments;

    this.logger.debug('Backups Manager', 'Get Volume Exports', arguments);

    return this.LibNodeNetappSoapApiService.callSoapApi(data.storage.uuid, 'nfs-exportfs-list-rules-2', {
      pathname: `/${data.volumeName}`,
      persistent: true
    }).then((res) => {
      if (res.status === 'error') throw new Error('Failed to get Volume Exports');

      console.log(res);

      // Check export that allows "all-hosts"
      const allHostsExport = res.data['exports-rule-info-2']['security-rules']['security-rule-info'].filter(obj => {
        return obj['read-write']['exports-hostname-info']['all-hosts'] === true;
      });

      if (allHostsExport.length === 0) {

        // TODO: check connectivity from NFS node
        this.logger.debug('Backups Manager', 'Getting network system', loggerArgs);
        return this.LibNodeVmwareSoapApiHelpersService.getHostConfigManagerNetworkSystem(data.virtual.uuid, data.host.info.obj.name).then((networkSystemData) => {
          if (networkSystemData.status === 'error') throw new Error('Failed to get networkSystem from vCenter');

          const networkSystem = networkSystemData.data;
          return this.LibNodeVmwareSoapApiHelpersService.getHostConfigManagerNetworkSystem(data.virtual.uuid, networkSystem);
        }).then((networkInfo: BackendResponse & { data: any[]; }) => {

          // @ts-ignore TODO
          if (res.status === 'error') throw new Error('Failed to get NetworkInfoConsoleVnic from vCenter');

          console.log(networkInfo);

          const esxiExportAddress = '0.0.0.0/0'; // TODO

          const esxiHostExport = res.data['exports-rule-info-2']['security-rules']['security-rule-info'].filter(obj => {
            return obj['read-write']['exports-hostname-info'].name === esxiExportAddress;
          });

          if (esxiHostExport.length === 0) {
            this.logger.debug('Backups Manager', 'No Volume Export matched, create it', loggerArgs);

            return this.LibNodeNetappSoapApiService.callSoapApi(data.storage.uuid, 'export-rule-create', {
              'client-match': esxiExportAddress,
              'policy-name': data.volume.info.data['volume-export-attributes'].policy,
              'ro-rule': {
                'security-flavor': 'any'
              },
              'rw-rule': {
                'security-flavor': 'never'
              },
              'rule-index': 1,
              'super-user-security': {
                'security-flavor': 'any'
              }
            });
          }

        }).then((setExportRuleData) => {
          if (setExportRuleData.status === 'error') throw new Error('Failed to create Volume Exports');
        });

      }

      return;
    });
  }

  /**
   * @description
   * Mount storage Datastore to ESXi host
   */
  mountVolumeToESXi(data: MountVolumeSnapshot | RestoreVolumeFiles | RestoreVmGuestFiles | VmInstantRecovery) {
    const loggerArgs = arguments;

    this.logger.debug('Backups Manager', 'Connection to vCenter using SOAP', arguments);

    return this.checkStorageVolumeExports(data).then(() => {

      return this.checkESXiFirewall(data);
    }).then(() => {

      // Get Datastore System from ESXi host to mount
      this.logger.debug('Backups Manager', 'Getting datastore system', loggerArgs);

      return Promise.all([
        this.LibNodeVmwareSoapApiHelpersService.getHostConfigManagerDatastoreSystem(data.virtual.uuid, data.host.info.obj.name),
        this.LibNodeNetappSoapApiService.callSoapApi(data.storage.uuid, 'nfs-service-get', {})
      ]);
    }).then((res) => {
      if (res[0].status === 'error') throw new Error('Failed to get datastoreSystem from vCenter');
      if (res[1].status === 'error') throw new Error('Failed to get NFS Service from Storage');

      const datastoreSystem: string = res[0].data;

      this.logger.debug('Backups Manager', 'Mount volume to ESXi', loggerArgs);

      // @ts-ignore TODO
      return this.LibNodeVmwareSoapApiService.callSoapApi(data.virtual.uuid, 'CreateNasDatastore', {
        _this: {
          $type: 'HostDatastoreSystem',
          _value: datastoreSystem
        },
        spec: {
          accessMode: 'readWrite',
          remoteHost: data.iface.info.data.address,
          remotePath: data.datastorePath,
          localPath: `/${data.volumeName}/`,
          type: (res[1].data['is-nfsv41-enabled'] ? 'NFS41' : 'NFS')
        }
      });

    }).then((res) => {
      if (res.status === 'error') throw new Error('Failed to mount Datastore to host');

      // Get mounted datastore name
      this.setRestoreState(data.uuid, 'mounted_to_esx');
      return res.data;

    }).then((res) => {
      if (res.status === 'error') throw new Error('Failed to get Datastore Properties from vCenter');

      // Return new Datastore for further use
      return res;

    }).catch((e) => {
      console.log(e);
      return e;
    });
  }

  /**
   * @description
   * Register and power on VM
   */
  registerVM(data: RestoreVmGuestFiles | VmInstantRecovery, esxiRestoredDatastore) {
    const loggerArgs = arguments;

    let vmPath = data.vm['summary.config.vmPathName'].split(']').pop();
    vmPath = vmPath.substring(0, vmPath.lastIndexOf('/') + 1).substr(1);

    // Get VM in Datastore (check if exist)
    return this.LibNodeVmwareSoapApiHelpersService.getVMFileDataFromDatastore(
      data.virtual.uuid,
      esxiRestoredDatastore,
      data.datastorePath,
      vmPath,
      data.vm['summary.config.vmPathName'].split('/').pop()
    ).then((res) => {
      if (res.status === 'error') throw new Error('Failed to get files from datastore');
      if (res.data[0].propSet.info.error) throw new Error(res.data[0].propSet.info.error);

      // Register VM
      // TODO: check if VM with same name exists
      this.logger.debug('Backups Manager', 'Register VM to ESXi', loggerArgs);

      // @ts-ignore TODO
      return this.LibNodeVmwareSoapApiService.callSoapApi(data.virtual.uuid, 'RegisterVM_Task', {
        _this: {
          $type: 'Folder',
          _value: data.folder.info.obj.name
        },
        path: '[' + data.datastorePath + '] ' + data.vm['summary.config.vmPathName'].split(']').pop().substr(1),
        name: data.vm.name,
        asTemplate: false,
        pool: {
          $type: 'ResourcePool',
          _value: data.resourcePool.info.obj.name
        },
        host: {
          $type: 'HostSystem',
          _value: data.host.info.obj.name
        }
      });

    }).then((res) => {
      if (res.status === 'error') throw new Error('Failed to register VM to vCenter');

      this.setRestoreState(data.uuid, 'vm_registred');

      // TODO
      console.log(res);
      data.vm.info.obj.name = res.data.result.name;

      // Set new uuid to this VM to prevent duplicates
      const newVMUuid = uuidv4();
      this.logger.debug('Backups Manager', 'Reconfigure VM uuid', loggerArgs);
      // TODO
      // @ts-ignore TODO
      return this.LibNodeVmwareSoapApiService.callSoapApi(data.virtual.uuid, 'ReconfigVM_Task', {
        _this: {
          $type: 'VirtualMachine',
          _value: data.vm.info.obj.name
        },
        spec: {
          uuid: newVMUuid
        }
      });
    }).then((res) => {
      if (res.status === 'error') throw new Error('Failed to change VM uuid');

      return this.goToSnapshot(data);

    }).then((res) => {
      if (res instanceof Error) throw new Error('Failed to revert VM to Snapshot');

    }).catch((e) => {
      console.log(e);
      return e;
    });

  }

  /**
   * @description
   * Restore a VM from Snapshot to same location (override)
   */
  restoreVMfromSnapshotToCurrentLocation(data: RestoreVm) {
    const loggerArgs = arguments;

    const sfrPromises = [];
    let vmPath;

    this.logger.debug('Backups Manager', 'Connection to vCenter using SOAP', arguments);

    return this.LibNodeVmwareSoapApiHelpersService.getVMPath(data.virtual.uuid, data.vm.info.obj.name).then((res) => {
      if (res && res.status === 'error') throw new Error('Failed to get VM path');

      const regex = /\[*]\s(.*)\/.*\.vmx/gi;
      const str = res.data.propSet['config.files.vmPathName'];

      vmPath = regex.exec(str)[1];

      if (!vmPath) throw new Error('SAFETY STOP: VM cannot be on root folder');

      this.logger.debug('Backups Manager', 'Get VM runtime', loggerArgs);

      return this.LibNodeVmwareSoapApiHelpersService.getVMRuntime(data.virtual.uuid, data.vm.info.obj.name);
    }).then((res) => {
      if (res && res.status === 'error') throw new Error('Failed to get VM runtime');

      if (res.data.propSet.runtime.powerState === 'poweredOn') {
        this.logger.debug('Backups Manager', 'Powering off VM', loggerArgs);

        // @ts-ignore TODO
        return this.LibNodeVmwareSoapApiService.callSoapApi(data.virtual.uuid, 'PowerOffVM_Task', {
          _this: {
            $type: 'VirtualMachine',
            _value: data.vm.info.obj.name
          }
        });
      }

      return res;

    }).then((res) => {
      if (res.status === 'error') throw new Error('Failed to power off VM at vCenter');

      this.logger.debug('Backups Manager', 'Get snapshot files from storage', loggerArgs);

      // TODO, folder recursive
      return this.LibNodeNetappFileSystemService.getFolder(`/vol/${data.volume.name}/.snapshot/${data.snapshot.name}/${vmPath}`, data.storage.uuid, data.vserver.name).toPromise();
    }).then((res: BackendResponse & { data: AnyOpsOSFile[]; }) => {
      if (res.status === 'error') throw new Error('Failed to get Snapshot files');

      res.data.forEach((file: { name: string }) => {
        if (file.name.indexOf('.lck') >= 0) return;

        sfrPromises.push(this.LibNodeNetappSoapApiService.callSoapApi(data.storage.uuid, 'snapshot-restore-file', {
          path: '/vol/' + data.volume.name + '/' + vmPath + '/' + file.name,
          snapshot: data.snapshot.name,
          volume: data.volume.name
        }).then((forRes) => {
          this.logger.debug('Backups Manager', 'Restoring file from storage snapshot', loggerArgs);

          if (forRes.status === 'error') throw new Error('Failed to restore file from storage snapshot');
        }));
      });

      return Promise.all(sfrPromises);

    }).then(() => {

      this.logger.debug('Backups Manager', 'Reloading VM', loggerArgs);

      // @ts-ignore TODO
      return this.LibNodeVmwareSoapApiService.callSoapApi(data.virtual.uuid, 'Reload', {
        _this: {
          $type: 'VirtualMachine',
          _value: data.vm.info.obj.name
        }
      });

    }).then((res) => {
      if (res.status === 'error') throw new Error('Failed to reload VM');

      return this.goToSnapshot(data);

    }).then((res) => {
      if (res instanceof Error) throw new Error('Failed to revert VM to Snapshot');

      return res;

    }).catch((e) => {
      console.log(e);
      return e;
    });
  }

  /**
   * goToSnapshot
   *
   * @description
   * Checks if VM have a snapshot called 'anyOpsOS_backup_*' and if exists reverts the VM to this snapshot
   */
  goToSnapshot(data: RestoreVmGuestFiles | VmInstantRecovery | RestoreVm) {
    const loggerArgs = arguments;

    let lastSnapshot: {
      name: string,
      snapshot: {
        name: string
      }
    };

    this.logger.debug('Backups Manager', 'Get all VM snapshots', arguments);

    return this.LibNodeVmwareSoapApiHelpersService.getVMSnapshots(data.virtual.uuid, data.vm.info.obj.name).then((res) => {
      if (res.status === 'error') throw new Error('Failed to get VM Snapshots');

      // No snapshots found
      if (!res.data[0].propSet) {
        this.logger.debug('Backups Manager', 'No snapshots found', loggerArgs);
        return res;
      }

      lastSnapshot = this.getLastSnapshot(res.data[0].propSet.snapshot.rootSnapshotList);

      if (lastSnapshot.name.startsWith('anyOpsOS_backup_')) {
        this.logger.debug('Backups Manager', 'Reverting VM to snapshot', loggerArgs);

        // @ts-ignore TODO
        return this.LibNodeVmwareSoapApiService.callSoapApi(data.virtual.uuid, 'RevertToSnapshot_Task', {
          _this: {
            $type: 'VirtualMachineSnapshot',
            _value: lastSnapshot.snapshot.name
          },
          suppressPowerOn: false
        });
      }

      this.logger.debug('Backups Manager', 'Last snapshot is not from anyOpsOS backup', loggerArgs);
      return res;

    }).then((res) => {
      if (res.status === 'error') throw new Error('Failed to get VM Snapshots');

      // No snapshots found
      if (!lastSnapshot) return res;

      if (lastSnapshot.name.startsWith('anyOpsOS_backup_')) {
        this.logger.debug('Backups Manager', 'Deleting VM snapshot', loggerArgs);

        // @ts-ignore TODO
        return this.LibNodeVmwareSoapApiService.callSoapApi(data.virtual.uuid, 'RemoveSnapshot_Task', {
          _this: {
            $type: 'VirtualMachineSnapshot',
            _value: lastSnapshot.snapshot.name
          },
          removeChildren: true,
          consolidate: true
        });
      }

      return res;

    }).then((res) => {
      if (res.status === 'error') throw new Error('Failed to delete VM Snapshot');

      return res;

    }).catch((e) => {
      console.log(e);
      return e;
    });
  }
}
