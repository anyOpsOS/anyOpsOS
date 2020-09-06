import { KubeObject } from './kube-object';
import { KubeObjectMetadata } from './kube-object-metadata';

export interface WorkloadKubeObject extends KubeObject {
  metadata: KubeObjectMetadata & {
    ownerReferences?: {
      apiVersion: string;
      kind: string;
      name: string;
      uid: string;
      controller: boolean;
      blockOwnerDeletion: boolean;
    }[];
  }

  // fixme: add type
  spec: any;
}