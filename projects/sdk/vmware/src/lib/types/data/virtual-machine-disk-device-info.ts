import {VirtualMachineTargetInfo} from './virtual-machine-target-info';

import {ManagedObjectReference} from './managed-object-reference';

export interface VirtualMachineDiskDeviceInfo extends VirtualMachineTargetInfo {
  capacity?: number;
  vm?: ManagedObjectReference & { $type: 'VirtualMachine[]'; };
}