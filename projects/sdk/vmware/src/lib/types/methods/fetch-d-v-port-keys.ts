import {ManagedObjectReference} from '../data/managed-object-reference';
import {DistributedVirtualSwitchPortCriteria} from '../data/distributed-virtual-switch-port-criteria';


export interface FetchDVPortKeys {
  _this: ManagedObjectReference;
  criteria?: DistributedVirtualSwitchPortCriteria;
}