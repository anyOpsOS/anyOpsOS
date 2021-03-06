import { Connection } from '@anyopsos/backend-core/app/types/connection';
import { DataObject } from '@anyopsos/backend-core/app/types/data-object';

export interface ConnectionKubernetes extends Connection {
  type: 'kubernetes';
  credential: string;
  clusterName: string;
  clusterServer: string;
  clusterCa: string;
  hopServerUuid: string;
  data: {
    Base: {
      name: string;
    };
    Data: (DataObject & { info: { data: any } })[];
  };
}
