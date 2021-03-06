import {OvfHardwareExport} from './ovf-hardware-export';

import {VirtualDeviceBackingInfo} from '../data/virtual-device-backing-info';

export interface OvfUnknownDeviceBacking extends OvfHardwareExport {
  backing: VirtualDeviceBackingInfo;
}