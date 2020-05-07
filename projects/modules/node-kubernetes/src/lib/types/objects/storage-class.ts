import {KubeObject} from './kube-object';

export interface StorageClass extends KubeObject {
  kind: 'StorageClass';
  provisioner: string; // e.g. "storage.k8s.io/v1"
  mountOptions?: string[];
  volumeBindingMode: string;
  reclaimPolicy: string;
  parameters: {
    [param: string]: string; // every provisioner has own set of these parameters
  }
}