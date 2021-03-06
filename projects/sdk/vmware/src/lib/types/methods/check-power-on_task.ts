import {ManagedObjectReference} from '../data/managed-object-reference';


export interface CheckPowerOn_Task {
  _this: ManagedObjectReference;
  vm: ManagedObjectReference & { $type: 'VirtualMachine'; };
  host?: ManagedObjectReference & { $type: 'HostSystem'; };
  pool?: ManagedObjectReference & { $type: 'ResourcePool'; };
  testType?: string[];
}