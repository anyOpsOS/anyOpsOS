import {KubeObject} from './kube-object';

export interface Namespace extends KubeObject {
  kind: 'Namespace';
  status?: {
    phase: string;
  }
}