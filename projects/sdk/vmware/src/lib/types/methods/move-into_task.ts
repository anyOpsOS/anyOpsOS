import {ManagedObjectReference} from '../data/managed-object-reference';


export interface MoveInto_Task {
  _this: ManagedObjectReference;
  host: ManagedObjectReference & { $type: 'HostSystem[]'; };
}