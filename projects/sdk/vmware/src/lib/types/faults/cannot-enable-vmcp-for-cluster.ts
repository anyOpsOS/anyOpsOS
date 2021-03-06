import {VimFault} from './vim-fault';

import {ManagedObjectReference} from '../data/managed-object-reference';

export interface CannotEnableVmcpForCluster extends VimFault {
  host?: ManagedObjectReference & { $type: 'HostSystem'; };
  hostName?: string;
  reason?: string;
}