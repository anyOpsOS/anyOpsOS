import {ManagedObjectReference} from '../data/managed-object-reference';


export interface PowerOnVM_Task {
  _this: ManagedObjectReference;
  host?: ManagedObjectReference & { $type: 'HostSystem'; };
}