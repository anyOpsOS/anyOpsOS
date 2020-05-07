import {KubeObject} from './kube-object';

export interface PersistentVolumeClaim extends KubeObject {
  kind: 'PersistentVolumeClaim';
  spec: {
    accessModes: string[];
    storageClassName: string;
    selector: {
      matchLabels: {
        release: string;
      };
      matchExpressions: {
        key: string; // environment,
        operator: string; // In,
        values: string[]; // [dev]
      }[];
    };
    resources: {
      requests: {
        storage: string; // 8Gi
      };
    };
  }
  status: {
    phase: string; // Pending
  }
}