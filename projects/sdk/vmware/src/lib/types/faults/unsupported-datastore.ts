import {VmConfigFault} from './vm-config-fault';

import {ManagedObjectReference} from '../data/managed-object-reference';

export interface UnsupportedDatastore extends VmConfigFault {
  datastore?: ManagedObjectReference & { $type: 'Datastore'; };
}