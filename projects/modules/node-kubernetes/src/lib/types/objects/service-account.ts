import {KubeObject} from './kube-object';

export interface ServiceAccount extends KubeObject {
  kind: 'ServiceAccount';
  secrets?: {
    name: string;
  }[]
  imagePullSecrets?: {
    name: string;
  }[]
}