import {ManagedObjectReference} from '../data/managed-object-reference';


export interface RemoveFilterEntities {
  _this: ManagedObjectReference;
  filterId: string;
  entities?: ManagedObjectReference & { $type: 'ManagedEntity[]'; };
}