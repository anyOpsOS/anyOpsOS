import { KubeObject } from './kube-object';

export interface Role extends KubeObject {
  kind: 'Role';
  rules: {
    verbs: string[];
    apiGroups: string[];
    resources: string[];
    resourceNames?: string[];
  }[]
}