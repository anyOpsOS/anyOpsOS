import {ManagedObjectReference} from '../data/managed-object-reference';


export interface EnableAlarmActions {
  _this: ManagedObjectReference;
  entity: ManagedObjectReference & { $type: 'ManagedEntity'; };
  enabled: boolean;
}