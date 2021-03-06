import { Injectable, ViewContainerRef } from '@angular/core';

import { v4 as uuidv4 } from 'uuid';

import { AnyOpsOSLibLoggerService } from '@anyopsos/lib-logger';
import { MatDialogRef } from '@anyopsos/lib-angular-material';
import { AnyOpsOSLibFileSystemService } from '@anyopsos/lib-file-system';
import { AnyOpsOSLibModalService } from '@anyopsos/lib-modal';
import { AnyOpsOSLibApplicationService } from '@anyopsos/lib-application';
import { AnyOpsOSLibNodeHelpersService } from '@anyopsos/lib-node';
import { BackendResponse } from '@anyopsos/backend-core/app/types/backend-response';
import { DataObject } from '@anyopsos/backend-core/app/types/data-object';
import { ConnectionNetapp, NetAppIface, NetAppSnapshot, NetAppVolume, NetAppVserver } from '@anyopsos/module-node-netapp';
import { ConnectionVmware, VMWareHost, VMWareFolder, VMWareResourcePool, VMWareVM } from '@anyopsos/module-node-vmware';

import { AnyOpsOSAppBackupsManagerHelpersService } from './anyopsos-app-backups-manager-helpers.service';
import { RestoreVolumeFiles } from '../types/restore-volume-files';
import { MountVolumeSnapshot } from '../types/mount-volume-snapshot';
import { RestoreVmGuestFiles } from '../types/restore-vm-guest-files';
import { VmInstantRecovery } from '../types/vm-instant-recovery';
import { RestoreVm } from '../types/restore-vm';
import { BackupVm } from '../types/backup-vm';

@Injectable({
  providedIn: 'root'
})
export class AnyOpsOSAppBackupsManagerService {

  private bodyContainer: ViewContainerRef;

  constructor(private readonly logger: AnyOpsOSLibLoggerService,
              private readonly LibModal: AnyOpsOSLibModalService,
              private readonly LibApplication: AnyOpsOSLibApplicationService,
              private readonly LibFileSystem: AnyOpsOSLibFileSystemService,
              private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService,
              private readonly BackupManagerHelpers: AnyOpsOSAppBackupsManagerHelpersService) {

  }

  /**
   * Sets the bodyContainerRef, this is used by Modals
   */
  setBodyContainerRef(bodyContainer: ViewContainerRef) {
    this.bodyContainer = bodyContainer;
  }

  setActive(uuid: string): void {

  }

  initBackups(): void {
    this.LibFileSystem.getConfigFile('applications/backups-manager/backups.json').subscribe(
      // TODO data type
      (res: BackendResponse & { data: unknown; }) => {
        this.logger.info('Backups Manager', 'Got backups successfully');

        // TODO this.BackupManagerHelpers.setBackup();
      },
      error => {
        this.logger.error('Backups Manager', 'Error while getting backups', null, error);
      });
  }

  initRestores(): void {
    this.LibFileSystem.getConfigFile('applications/backups-manager/restores.json').subscribe(
      // TODO data type
      (res: BackendResponse & { data: unknown; }) => {
        this.logger.info('Backups Manager', 'Got restores successfully');

        // TODO this.BackupManagerHelpers.setRestore();
      },
      error => {
        this.logger.error('Backups Manager', 'Error while getting restores', null, error);
      });
  }

  async mountVolumeSnapshot(dataObj: { snapshot: DataObject & { info: { data: NetAppSnapshot } } }): Promise<void> {
    this.logger.debug('Backups Manager', 'Received event mountVolumeSnapshot -> Initializing mount of Volume');

    const modalInstance: MatDialogRef<any> = await this.LibModal.openRegisteredModal(
      'backups-manager-recovery-wizard',
      this.bodyContainer,
      {
        type: 'mount_volume_snapshot',
        title: `Select required data to Mount a Volume Snapshot`,
        data: dataObj
      });

    modalInstance.afterClosed().subscribe(async (
      selectedData: {
        selectedSnapshot: DataObject & { info: { data: NetAppSnapshot } };
        selectedIface: DataObject & { info: { data: NetAppIface } };
        selectedHost: DataObject & { info: { data: VMWareHost } };
      }
    ) => {
      if (!selectedData) return;

      this.logger.debug('Backups Manager', 'Received restore data from Modal');

      const virtual: ConnectionVmware = this.LibNodeHelpers.getConnectionByUuid(selectedData.selectedHost.info.mainUuid, 'vmware') as ConnectionVmware;
      const storage: ConnectionNetapp = this.LibNodeHelpers.getConnectionByUuid(selectedData.selectedSnapshot.info.mainUuid, 'netapp') as ConnectionNetapp;
      const vServer: DataObject & { info: { data: NetAppVserver } } = this.LibNodeHelpers.getParentObjectByType(
        storage.uuid,
        'netapp',
        'vserver',
        selectedData.selectedSnapshot.info.parent
      );
      const volume: DataObject & { info: { data: NetAppVolume } } = this.LibNodeHelpers.getParentObjectByType(
        storage.uuid,
        'netapp',
        'volume',
        selectedData.selectedSnapshot.info.parent
      );

      const data: MountVolumeSnapshot = {
        uuid: uuidv4(),
        storage,
        vserver: vServer,
        volume,
        snapshot: selectedData.selectedSnapshot,
        virtual,
        host: selectedData.selectedHost,
        iface: selectedData.selectedIface,
      };

      this.BackupManagerHelpers.setRestore(data.uuid, {
        name: `Datastore mount (${data.volume.name})`,
        data,
        state: ['init'],
        log: []
      });
      this.setActive(data.uuid);

      const littleModalRef: MatDialogRef<any> = await this.LibModal.openLittleModal(
        this.bodyContainer,
        'PLEASE WAIT',
        `Mounting ${data.volume.name} from Snapshot...`);

      return this.BackupManagerHelpers.mountRestoreSnapshotDatastore(data).then((res) => {
        if (res instanceof Error) throw new Error('Failed to mount Volume Snapshot');

        this.logger.debug('Backups Manager', 'Restore finished successfully');

        this.LibModal.closeModal(littleModalRef.id);
        this.BackupManagerHelpers.setRestoreState(data.uuid, 'end');
      }).catch((e) => {
        this.LibModal.closeModal(littleModalRef.id);
        return this.LibApplication.errorHandler(e.message);
      });

    });
  }

  async restoreVolumeFiles(dataObj: { snapshot?: DataObject & { info: { data: NetAppSnapshot } }, volume?: DataObject & { info: { data: NetAppVolume } } }): Promise<void> {
    this.logger.debug('Backups Manager', 'Received event RestoreVolumeFiles -> Initializing restore of datastore files');
    const modalInstance: MatDialogRef<any> = await this.LibModal.openRegisteredModal(
      'backups-manager-recovery-wizard',
      this.bodyContainer,
      {
        type: 'restore_volume_files',
        title: `Select required data to Restore Volume Files`,
        data: dataObj
      });

    modalInstance.afterClosed().subscribe(async (
      selectedData: {
        selectedSnapshot: DataObject & { info: { data: NetAppSnapshot } };
        selectedIface: DataObject & { info: { data: NetAppIface } };
        selectedHost: DataObject & { info: { data: VMWareHost } };
      }
    ) => {
      if (!selectedData) return;

      this.logger.debug('Backups Manager', 'Received restore data from Modal');

      const virtual: ConnectionVmware = this.LibNodeHelpers.getConnectionByUuid(selectedData.selectedHost.info.mainUuid, 'vmware') as ConnectionVmware;
      const storage: ConnectionNetapp = this.LibNodeHelpers.getConnectionByUuid(selectedData.selectedSnapshot.info.mainUuid, 'netapp') as ConnectionNetapp;
      const vServer: DataObject & { info: { data: NetAppVserver } } = this.LibNodeHelpers.getParentObjectByType(
        storage.uuid,
        'netapp',
        'vserver',
        selectedData.selectedSnapshot.info.parent
      );
      const volume: DataObject & { info: { data: NetAppVolume } } = this.LibNodeHelpers.getParentObjectByType(
        storage.uuid,
        'netapp',
        'volume',
        selectedData.selectedSnapshot.info.parent
      );

      const data: RestoreVolumeFiles = {
        uuid: uuidv4(),
        storage,
        vserver: vServer,
        volume,
        snapshot: selectedData.selectedSnapshot,
        virtual,
        host: selectedData.selectedHost,
        iface: selectedData.selectedIface,
        esxiDatastoreName: 'anyOpsOS_' + volume['volume-id-attributes']['junction-path'].substr(1)
      };

      this.BackupManagerHelpers.setRestore(
        data.uuid,
        {
          name: `Datastore restore (${data.volume['volume-id-attributes'].name})`,
          data,
          state: ['init'],
          log: []
        });
      this.setActive(data.uuid);

      const littleModalRef: MatDialogRef<any> = await this.LibModal.openLittleModal(
        this.bodyContainer,
        'PLEASE WAIT',
        `Restoring ${data.volume.name} files from Snapshot...`);

      return this.BackupManagerHelpers.restoreSnapshotDatastoreFiles(data).then((res) => {
        if (res instanceof Error) throw new Error('Failed to restore snapshot into datastore files');

        this.logger.debug('Backups Manager', 'Restore finished successfully');

        // Open Datastore Brower application
        this.LibApplication.openApplication(
          'datastore-explorer',
          {
            credential: data.virtual.credential,
            host: data.virtual.host,
            port: data.virtual.port,
            type: 'vmware',
            data: {},
            original_datastore: data.volume.name
          });

        this.LibModal.closeModal(littleModalRef.id);
        this.BackupManagerHelpers.setRestoreState(data.uuid, 'end');
      }).catch((e) => {
        this.LibModal.closeModal(littleModalRef.id);
        return this.LibApplication.errorHandler(e.message);
      });

    });
  }

  async restoreVmGuestFiles(dataObj: { vm: DataObject & { info: { data: VMWareVM } }, snapshot?: DataObject & { info: { data: NetAppSnapshot } } }): Promise<void> {
    this.logger.debug('Backups Manager', `Received event restoreVmGuestFiles -> Initializing restore of VM guest files [${dataObj.vm.name}]`);

    const modalInstance: MatDialogRef<any> = await this.LibModal.openRegisteredModal(
      'backups-manager-recovery-wizard',
      this.bodyContainer,
      {
        type: 'restore_vm_guest_files',
        title: `Select required data to Restore VM (${dataObj.vm.name}) Guest Files`,
        data: dataObj
      });

    modalInstance.afterClosed().subscribe(async (
      selectedData: {
        selectedSnapshot: DataObject & { info: { data: NetAppSnapshot } };
        selectedIface: DataObject & { info: { data: NetAppIface } };
        selectedHost: DataObject & { info: { data: VMWareHost } };
        selectedFolder: DataObject & { info: { data: VMWareFolder } };
        selectedResourcePool: DataObject & { info: { data: VMWareResourcePool } };
      }
    ) => {
      if (!selectedData) return;

      this.logger.debug('Backups Manager', 'Received restore data from Modal');

      const virtual: ConnectionVmware = this.LibNodeHelpers.getConnectionByUuid(selectedData.selectedHost.info.mainUuid, 'vmware') as ConnectionVmware;
      const storage: ConnectionNetapp = this.LibNodeHelpers.getConnectionByUuid(selectedData.selectedSnapshot.info.mainUuid, 'netapp') as ConnectionNetapp;
      const vServer: DataObject & { info: { data: NetAppVserver } } = this.LibNodeHelpers.getParentObjectByType(
        storage.uuid,
        'netapp',
        'vserver',
        selectedData.selectedSnapshot.info.parent
      );
      const volume: DataObject & { info: { data: NetAppVolume } } = this.LibNodeHelpers.getParentObjectByType(
        storage.uuid,
        'netapp',
        'volume',
        selectedData.selectedSnapshot.info.parent
      );

      // TODO: folder.folder & resource_pool.resource_pool are required to publish the VM
      const data: RestoreVmGuestFiles = {
        uuid: uuidv4(),
        storage,
        vserver: vServer,
        volume,
        snapshot: selectedData.selectedSnapshot,
        virtual,
        host: selectedData.selectedHost,
        iface: selectedData.selectedIface,
        vm: dataObj.vm,
        folder: selectedData.selectedFolder,
        resourcePool: selectedData.selectedResourcePool,
      };

      this.BackupManagerHelpers.setRestore(
        data.uuid,
        {
          name: `VM guest files (${data.vm.name})`,
          data,
          state: ['init'],
          log: []
        });
      this.setActive(data.uuid);

      const littleModalRef: MatDialogRef<any> = await this.LibModal.openLittleModal(
        this.bodyContainer,
        'PLEASE WAIT',
        `Restoring ${data.vm.name} guest files from Snapshot...`);

      return this.BackupManagerHelpers.restoreSnapshotVMGuestFiles(data).then((res) => {
        if (res instanceof Error) throw new Error('Failed to restore snapshot into VM guest files');

        this.logger.debug('Backups Manager', 'Restore finished successfully');

        this.LibModal.closeModal(littleModalRef.id);
        this.BackupManagerHelpers.setRestoreState(data.uuid, 'end');
      }).catch((e) => {
        this.LibModal.closeModal(littleModalRef.id);
        return this.LibApplication.errorHandler(e.message);
      });

    });
  }

  async vmInstantRecovery(dataObj: { vm: DataObject & { info: { data: VMWareVM } }, snapshot?: DataObject & { info: { data: NetAppSnapshot } } }): Promise<void> {
    this.logger.debug('Backups Manager', `Received event vmInstantRecovery -> Initializing restore of VM [${dataObj.vm.name}]`);

    const modalInstance: MatDialogRef<any> = await this.LibModal.openRegisteredModal(
      'backups-manager-recovery-wizard',
      this.bodyContainer,
      {
        type: 'vm_instant_recovery',
        title: `Select required data to perform an Instant VM (${dataObj.vm.name})`,
        data: dataObj
      });

    modalInstance.afterClosed().subscribe(async (
      selectedData: {
        selectedSnapshot: DataObject & { info: { data: NetAppSnapshot } };
        selectedIface: DataObject & { info: { data: NetAppIface } };
        selectedHost: DataObject & { info: { data: VMWareHost } };
        selectedFolder: DataObject & { info: { data: VMWareFolder } };
        selectedResourcePool: DataObject & { info: { data: VMWareResourcePool } };
        vmName: string;
        powerOnVm: boolean;
      }
    ) => {
      if (!selectedData) return;

      const virtual: ConnectionVmware = this.LibNodeHelpers.getConnectionByUuid(selectedData.selectedHost.info.mainUuid, 'vmware') as ConnectionVmware;
      const storage: ConnectionNetapp = this.LibNodeHelpers.getConnectionByUuid(selectedData.selectedSnapshot.info.mainUuid, 'netapp') as ConnectionNetapp;
      const vServer: DataObject & { info: { data: NetAppVserver } } = this.LibNodeHelpers.getParentObjectByType(
        storage.uuid,
        'netapp',
        'vserver',
        selectedData.selectedSnapshot.info.parent
      );
      const volume: DataObject & { info: { data: NetAppVolume } } = this.LibNodeHelpers.getParentObjectByType(
        storage.uuid,
        'netapp',
        'volume',
        selectedData.selectedSnapshot.info.parent
      );

      const data: VmInstantRecovery = {
        uuid: uuidv4(),
        storage,
        vserver: vServer,
        volume,
        snapshot: selectedData.selectedSnapshot,
        virtual,
        host: selectedData.selectedHost,
        iface: selectedData.selectedIface,
        vm: dataObj.vm,
        folder: selectedData.selectedFolder,
        resourcePool: selectedData.selectedResourcePool,
        vmName: selectedData.vmName,
        powerOnVm: selectedData.powerOnVm
      };

      this.BackupManagerHelpers.setRestore(data.uuid, {
        name: `VM instant recovery (${data.vm.name})`,
        data,
        state: ['init'],
        log: []
      });
      this.setActive(data.uuid);

      this.logger.debug('Backups Manager', 'Received restore data from Modal as new location');

      const littleModalRef: MatDialogRef<any> = await this.LibModal.openLittleModal(
        this.bodyContainer,
        'PLEASE WAIT',
        `Restoring ${data.vm.name} from Snapshot...`);

      return this.BackupManagerHelpers.restoreSnapshotIntoInstantVM(data).then((res) => {
        if (res instanceof Error) throw new Error('Failed to restore snapshot into Instant VM');

        this.logger.debug('Backups Manager', 'Restore finished successfully');

        this.LibModal.closeModal(littleModalRef.id);
        this.BackupManagerHelpers.setRestoreState(data.uuid, 'end');
      }).catch((e) => {
        this.LibModal.closeModal(littleModalRef.id);
        return this.LibApplication.errorHandler(e.message);
      });

    });
  }

  async restoreVm(dataObj: { vm: DataObject & { info: { data: VMWareVM } }, snapshot?: DataObject & { info: { data: NetAppSnapshot } } }): Promise<void> {
    this.logger.debug('Backups Manager', `Received event restoreVm -> Initializing restore of VM [${dataObj.vm.name}]`);

    const modalInstance: MatDialogRef<any> = await this.LibModal.openRegisteredModal(
      'backups-manager-recovery-wizard',
      this.bodyContainer,
      {
        type: 'restore_vm',
        title: `Select required data to Restore VM (${dataObj.vm.name})`,
        data: dataObj
      });

    modalInstance.afterClosed().subscribe(async (
      selectedData: {
        selectedSnapshot: DataObject & { info: { data: NetAppSnapshot } };
        selectedIface: DataObject & { info: { data: NetAppIface } };
        selectedHost: DataObject & { info: { data: VMWareHost } };
        selectedFolder: DataObject & { info: { data: VMWareFolder } };
        selectedResourcePool: DataObject & { info: { data: VMWareResourcePool } };
        powerOnVm: boolean;
      }
    ) => {
      if (!selectedData) return;

      const virtual: ConnectionVmware = this.LibNodeHelpers.getConnectionByUuid(selectedData.selectedHost.info.mainUuid, 'vmware') as ConnectionVmware;
      const storage: ConnectionNetapp = this.LibNodeHelpers.getConnectionByUuid(selectedData.selectedSnapshot.info.mainUuid, 'netapp') as ConnectionNetapp;
      const vServer: DataObject & { info: { data: NetAppVserver } } = this.LibNodeHelpers.getParentObjectByType(
        storage.uuid,
        'netapp',
        'vserver',
        selectedData.selectedSnapshot.info.parent
      );
      const volume: DataObject & { info: { data: NetAppVolume } } = this.LibNodeHelpers.getParentObjectByType(
        storage.uuid,
        'netapp',
        'volume',
        selectedData.selectedSnapshot.info.parent
      );

      const data: RestoreVm = {
        uuid: uuidv4(),
        storage,
        vserver: vServer,
        volume,
        snapshot: selectedData.selectedSnapshot,
        virtual,
        host: selectedData.selectedHost,
        vm: dataObj.vm,
        folder: selectedData.selectedFolder,
        resourcePool: selectedData.selectedResourcePool,
        powerOnVm: selectedData.powerOnVm
      };

      this.BackupManagerHelpers.setRestore(data.uuid, {
        name: `VM restore (${data.vm.name})`,
        data,
        state: ['init'],
        log: []
      });
      this.setActive(data.uuid);

      this.logger.debug('Backups Manager', 'Received restore data from Modal as Original location');

      const littleModalRef: MatDialogRef<any> = await this.LibModal.openLittleModal(
        this.bodyContainer,
        'PLEASE WAIT',
        `Restoring ${data.vm.name} from Snapshot...`);

      return this.BackupManagerHelpers.restoreSnapshotIntoVM(data).then((res) => {
        if (res instanceof Error) throw new Error('Failed to restore snapshot into VM');

        this.logger.debug('Backups Manager', 'Restore finished successfully');

        this.LibModal.closeModal(littleModalRef.id);
        this.BackupManagerHelpers.setRestoreState(data.uuid, 'end');
      }).catch((e) => {
        this.LibModal.closeModal(littleModalRef.id);
        return this.LibApplication.errorHandler(e.message);
      });

    });
  }

  async backupVm(data: BackupVm): Promise<void> {
    data.uuid = uuidv4();

    this.logger.debug('Backups Manager', 'Received event backupVm -> Initializing backup');

    this.BackupManagerHelpers.setBackup(data.uuid, {
      name: `VM backup (${data.vm.name})`,
      data,
      state: [
        'init'
      ],
      log: []
    });
    this.setActive(data.uuid);

    const modalInstance: MatDialogRef<any> = await this.LibModal.openRegisteredModal(
      'backups-manager-backup-wizard',
      this.bodyContainer,
      {
        title: 'Backup Wizard',
        backupObject: data.vm
      });

    modalInstance.afterClosed().subscribe(async (
      selectedData
    ) => {
      if (!selectedData) return;

      data.backupName = `VM backup (${selectedData.backupName})`;

      this.logger.debug('Backups Manager', 'Received backup data from Modal');

      const littleModalRef: MatDialogRef<any> = await this.LibModal.openLittleModal(
        this.bodyContainer,
        'PLEASE WAIT',
        `Backing up ${selectedData.backupName}...`);

      return this.BackupManagerHelpers.startVMBackup(data).then((res) => {
        if (res instanceof Error) throw new Error('Failed to backup VM');

        this.logger.debug('Backups Manager', 'Backup finished successfully');

        this.LibModal.closeModal(littleModalRef.id);
        this.BackupManagerHelpers.setBackupState(data.uuid, 'end');
      }).catch((e) => {
        this.LibModal.closeModal(littleModalRef.id);
        return this.LibApplication.errorHandler(e.message);
      });

    });
  }

}
