import {CannotAccessVmDevice} from './cannot-access-vm-device';

import {LocalizedMethodFault} from '../data/localized-method-fault';

export interface CannotAccessVmDisk extends CannotAccessVmDevice {
  fault: LocalizedMethodFault;
}