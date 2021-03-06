import socketControllers from 'socket-controllers';

// TODO ESM
const { getSocketIO } = socketControllers;

import { AnyOpsOSConfigFileModule } from '@anyopsos/module-config-file';
import { DataObject } from '@anyopsos/backend-core/app/types/data-object';
import { KUBERNETES_CONFIG_FILE } from './anyopsos-module-node-kubernetes.constants';

export class AnyOpsOSNodeKubernetesDataRefresherModule {

  private readonly ConfigFileModule: AnyOpsOSConfigFileModule;

  constructor(private readonly userUuid: string,
              private readonly workspaceUuid: string,
              private readonly connectionUuid: string) {

    this.ConfigFileModule = new AnyOpsOSConfigFileModule(this.userUuid, this.workspaceUuid);
  }

  async retry<T>(
    fn: () => Promise<T>,
    retriesLeft: number = 3,
    interval: number = 1000,
    exponential: boolean = false
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retriesLeft) {
        await new Promise(r => setTimeout(r, interval));
        return this.retry(
          fn,
          retriesLeft - 1,
          exponential ? interval * 2 : interval,
          exponential
        );
      } else throw new Error(`Max retries reached for function ${fn.name}`);
    }
  }


  async createConnectionFolders() {
    const folders = [
      'Nodes',
      'Cluster Roles',
      'Cluster Role Bindings',
      'Persistent Volumes',
      'Storage Classes',
      'Namespaces',
    ];

    for (const folder of folders) {

      const objectUuid: string = `${this.connectionUuid}#kubernetes;\u003c${folder}:Folder\u003e`;

      const newObj: DataObject = {
        name: folder,
        type: 'Folder',
        info: {
          uuid: objectUuid,
          mainUuid: this.connectionUuid,
          obj: {
            type: 'Folder',
            name: folder
          },
          parent: null,
          data: {}
        }
      };

      // Put data object
      await this.ConfigFileModule.put(KUBERNETES_CONFIG_FILE, newObj, this.connectionUuid, objectUuid);
      getSocketIO().to(this.workspaceUuid).emit('[kubernetes-data]', {
        connectionUuid: this.connectionUuid,
        data: {
          op: 'put',
          uuid: newObj.info.uuid,
          data: newObj
        }
      });
    }
  }

  private createNamespaceFolders(namespaceObj: DataObject) {

    const parent = namespaceObj.info.obj;
    const folders = [
      'Ingresses',
      'Services',
      'Endpoints',
      'Config Maps',
      'Secrets',
      'Persistent Volume Claims',
      'Service Accounts',
      'Roles',
      'Role Bindings'
    ];

    folders.forEach((folder: string) => {

      const objectUuid: string = `${this.connectionUuid}#kubernetes;\u003c${namespaceObj.name}-${folder}:Folder\u003e`;

      const newObj: DataObject = {
        name: folder,
        type: 'Folder',
        info: {
          uuid: objectUuid,
          mainUuid: this.connectionUuid,
          obj: {
            type: 'Folder',
            name: `${namespaceObj.name}-${folder}`
          },
          parent,
          data: {}
        }
      };

      // Put data object
      this.ConfigFileModule.put(KUBERNETES_CONFIG_FILE, newObj, this.connectionUuid, objectUuid);
      getSocketIO().to(this.workspaceUuid).emit('[kubernetes-data]', {
        connectionUuid: this.connectionUuid,
        data: {
          op: 'put',
          uuid: newObj.info.uuid,
          data: newObj
        }
      });
    });

  }

  /**
   * Set each returned object in an anyOpsOS readable way
   */
  async parseObject(type: 'ADDED' | 'MODIFIED' | 'DELETED' | string, object: any): Promise<void> {

    if (type === 'DELETED') {
      const objectUuid: string = `${this.connectionUuid}#kubernetes;\u003c${object.metadata.name}:${object.kind}\u003e`;

      // Put data object
      this.ConfigFileModule.delete(KUBERNETES_CONFIG_FILE, this.connectionUuid, objectUuid);
      getSocketIO().to(this.workspaceUuid).emit('[kubernetes-data]', {
        connectionUuid: this.connectionUuid,
        data: {
          op: 'delete',
          uuid: objectUuid
        }
      });
    }

    // Set basic object data
    if (type === 'ADDED' || type === 'MODIFIED') {
      if (object.metadata.ownerReferences && object.metadata.ownerReferences.length !== 1) console.log('multiple', object.metadata.ownerReferences);

      const objectParent = (object.metadata.ownerReferences ? {
        type: object.metadata.ownerReferences[0].kind,
        name: object.metadata.ownerReferences[0].uid
      } :

        object.kind === 'Event' ? {
          type: object.involvedObject.kind,
          name: object.involvedObject.uid,
        } :

          object.metadata.namespace ?

            object.kind === 'Endpoints' ? {
              type: 'Folder',
              name: object.metadata.namespace + '-Endpoints'
            } : object.kind === 'Ingress' ? {
              type: 'Folder',
              name: object.metadata.namespace + '-Ingresses'
            } : object.kind === 'Service' ? {
              type: 'Folder',
              name: object.metadata.namespace + '-Services'
            } : object.kind === 'ConfigMap' ? {
              type: 'Folder',
              name: object.metadata.namespace + '-Config Maps'
            } : object.kind === 'PersistentVolumeClaim' ? {
              type: 'Folder',
              name: object.metadata.namespace + '-Persistent Volume Claims'
            } : object.kind === 'Secret' ? {
              type: 'Folder',
              name: object.metadata.namespace + '-Secrets'
            } : object.kind === 'ServiceAccount' ? {
              type: 'Folder',
              name: object.metadata.namespace + '-Service Accounts'
            } : object.kind === 'RoleBinding' ? {
              type: 'Folder',
              name: object.metadata.namespace + '-Role Bindings'
            } : object.kind === 'Role' ? {
              type: 'Folder',
              name: object.metadata.namespace + '-Roles'
            } : {
                                type: 'Namespace',
                                name: object.metadata.namespace
                              } :

            object.kind === 'PersistentVolume' ? {
              type: 'Folder',
              name: 'Persistent Volumes'
            } : object.kind === 'ClusterRole' ? {
              type: 'Folder',
              name: 'Cluster Roles'
            } : object.kind === 'StorageClass' ? {
              type: 'Folder',
              name: 'Storage Classes'
            } : object.kind === 'ClusterRoleBinding' ? {
              type: 'Folder',
              name: 'Cluster Role Bindings'
            } : object.kind === 'Node' ? {
              type: 'Folder',
              name: 'Nodes'
            } : object.kind === 'Namespace' ? {
              type: 'Folder',
              name: 'Namespaces'
            } : null);

      // ControllerRevision
      // VolumeAttachment
      // Event

      // Cause the way top nodes (DaemonSet, StatefulSet...) are handled (without ownerReferences), the obj.name for a
      // namespace is based on namespace name instead of namespace
      const objectUuid: string = `${this.connectionUuid}#kubernetes;\u003c${object.metadata.uid}:${object.kind}\u003e`;

      const newObj: DataObject = {
        name: object.metadata.name,
        type: object.kind,
        info: {
          uuid: objectUuid,
          mainUuid: this.connectionUuid,
          obj: {
            type: object.kind,
            name: object.kind === 'Namespace' ? object.metadata.name : object.metadata.uid
          },
          parent: objectParent,
          data: object
        }
      };

      // Create Namespaces folders
      if (type === 'ADDED' && object.kind === 'Namespace') {
        this.createNamespaceFolders(newObj);
      }

      if (type === 'ADDED') {

        // Put data object
        this.ConfigFileModule.put(KUBERNETES_CONFIG_FILE, newObj, this.connectionUuid, objectUuid);
        getSocketIO().to(this.workspaceUuid).emit('[kubernetes-data]', {
          connectionUuid: this.connectionUuid,
          data: {
            op: 'put',
            uuid: newObj.info.uuid,
            data: newObj
          }
        });

      } else if (type === 'MODIFIED') {

        // Patch data object
        this.retry(this.ConfigFileModule.patch(KUBERNETES_CONFIG_FILE, newObj, this.connectionUuid, objectUuid) as any, 5, 1000, true);
        getSocketIO().to(this.workspaceUuid).emit('[kubernetes-data]', {
          connectionUuid: this.connectionUuid,
          data: {
            op: 'patch',
            uuid: newObj.info.uuid,
            data: newObj
          }
        });

      }
    }

    if (type !== 'ADDED' && type !== 'MODIFIED' && type !== 'DELETED') console.log(object);
  }

}
