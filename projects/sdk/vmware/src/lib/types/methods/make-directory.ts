import {ManagedObjectReference} from '../data/managed-object-reference';


export interface MakeDirectory {
  _this: ManagedObjectReference;
  name: string;
  datacenter?: ManagedObjectReference & { $type: 'Datacenter'; };
  createParentDirectories?: boolean;
}