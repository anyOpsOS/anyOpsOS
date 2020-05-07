import { KubeObject } from './kube-object';

export interface ConfigMap extends KubeObject {
  kind: 'ConfigMap';
  data: {
    [param: string]: string;
  }
}