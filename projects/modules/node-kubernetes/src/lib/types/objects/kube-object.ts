import { KubeObjectMetadata } from './kube-object-metadata';

export interface KubeObject {
  apiVersion: string
  kind: string
  metadata: KubeObjectMetadata;
}