import { Injectable } from '@angular/core';

import { AnyOpsOSLibNodeHelpersService } from '@anyopsos/lib-node';
import { ConnectionNetapp, NetAppIface, NetAppVolume, NetAppVserver } from '@anyopsos/module-node-netapp';
import { VMWareDatastore } from '@anyopsos/module-node-vmware';
import { DataObject } from '@anyopsos/backend-core/app/types/data-object';

@Injectable({
  providedIn: 'root'
})
export class AnyOpsOSAppInfrastructureManagerNodeLinkService {

  constructor(private readonly LibNodeHelpers: AnyOpsOSLibNodeHelpersService) {
  }

  /**
   * Check if Volume is linked to any managed VMWare Datastore
   * Not perfect code but easier to maintain
   */
  checkStorageVolumeLinkWithManagedVMWareDatastore(volumeObj: DataObject & { info: { data: NetAppVolume } }): (DataObject & { info: { data: VMWareDatastore } })[] {
    const results = [];

    const datastores: (DataObject & { info: { data: VMWareDatastore } })[] = this.LibNodeHelpers.getObjectsByType(null, 'vmware', 'Datastore');

    for (const datastoreObj of datastores) {
      const linkedWith: DataObject & { info: { data: NetAppVolume } } = this.checkVMWareDatastoreLinkWithManagedStorageVolume(datastoreObj);

      if (linkedWith?.info?.uuid === volumeObj.info.uuid) results.push(datastoreObj);
    }

    return results;
  }

  /**
   * Check if VMWare Datastore is linked to any managed storage
   */
  checkVMWareDatastoreLinkWithManagedStorageVolume(datastoreObj: DataObject & { info: { data: VMWareDatastore } }): DataObject & { info: { data: NetAppVolume } } {
    const results = [];

    const netappConnections: ConnectionNetapp[] = this.LibNodeHelpers.getConnectionsByType('netapp') as ConnectionNetapp[];
    for (const storageObj of netappConnections) {

      // Checking for NetApp storage
      if (storageObj.type === 'netapp') {

        // check if storage has any interface that match the datastore.remoteHost and datastore.type
        const netIfaces: (DataObject & { info: { data: NetAppIface } })[] = this.LibNodeHelpers.getObjectsByType(storageObj.uuid, 'netapp', 'netiface');

        const foundInterface: DataObject & { info: { data: NetAppIface } } = netIfaces.filter((ifaceObj: DataObject & { info: { data: NetAppIface } }) => {
          return ifaceObj.info.data.address === datastoreObj.info.data.info.nas.remoteHost &&
            ifaceObj.info.data['data-protocols']['data-protocol'] === (
              datastoreObj.info.data.info.nas.type === 'NFS41' ||
                datastoreObj.info.data.info.nas.type === 'NFS' ? 'nfs' :
                datastoreObj.info.data.info.nas.type
            );
        })[0];

        // If not found any storage interface matching, return
        if (!foundInterface) continue;

        // Search any Data Vservers with allowed protocol that match the datastore.type
        const vServers: (DataObject & { info: { data: NetAppVserver } })[] = this.LibNodeHelpers.getObjectsByType(storageObj.uuid, 'netapp', 'vserver');

        const foundVserver: DataObject & { info: { data: NetAppVserver } } = vServers.filter((vserverObj: DataObject & { info: { data: NetAppVserver } }) => {
          return vserverObj.info.data['vserver-type'] === 'data' &&
            vserverObj.name === foundInterface.info.data.vserver &&
            vserverObj.info.data['allowed-protocols'].protocol.includes(
              (datastoreObj.info.data.info.nas.type === 'NFS41' || datastoreObj.info.data.info.nas.type === 'NFS' ? 'nfs' : datastoreObj.info.data.info.nas.type)
            );
        })[0];

        if (!foundVserver) continue;

        // Search for each Volume containing as a junction path the current datastore remotePath
        const volumes: (DataObject & { info: { data: NetAppVolume } })[] = this.LibNodeHelpers.getChildObjectsByType(storageObj.uuid, 'netapp', 'volume', foundVserver.info.obj);
        const foundVolume: DataObject & { info: { data: NetAppVolume } } = volumes.filter((volumeObj: DataObject & { info: { data: NetAppVolume } }) => {
          return volumeObj.info.data['volume-id-attributes']['junction-path'] === datastoreObj.info.data.info.nas.remotePath;
        })[0];

        if (!foundVolume) continue;

        // TODO: CHECK VOLUME EXPORTS that match ESXi host

        // Link found!
        results.push(foundVolume);
      }

    }

    // If multiple links are found means this function is not working properly
    if (results.length > 1) throw new Error('Multiple links found for this Datastore');

    return results[0];
  }
}
