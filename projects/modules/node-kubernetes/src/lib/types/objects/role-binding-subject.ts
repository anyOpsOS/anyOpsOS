export interface RoleBindingSubject {
  kind: string;
  name: string;
  namespace?: string;
  apiGroup?: string;
}
