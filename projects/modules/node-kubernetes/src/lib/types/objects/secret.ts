import {SecretType} from './secret-type';
import {KubeObject} from './kube-object';

export interface Secret extends KubeObject {
  kind: 'Secret';
  type: SecretType;
  data: {
    [prop: string]: string | undefined; // TODO remove undefined
    token?: string;
  }
}