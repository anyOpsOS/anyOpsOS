import {RoleBindingSubject} from './role-binding-subject';
import {KubeObject} from './kube-object';

export interface RoleBinding extends KubeObject {
  kind: 'RoleBinding';
  subjects?: RoleBindingSubject[];
  roleRef: {
    kind: string;
    name: string;
    apiGroup?: string;
  }
}