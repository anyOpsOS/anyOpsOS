import {ResourceQuotaValues} from './resource-quota-values';
import {KubeObject} from './kube-object';

export interface ResourceQuota extends KubeObject {
  kind: 'ResourceQuota';
  spec: {
    hard: ResourceQuotaValues;
    scopeSelector?: {
      matchExpressions: {
        operator: string;
        scopeName: string;
        values: string[];
      }[];
    };
  }

  status: {
    hard: ResourceQuotaValues;
    used: ResourceQuotaValues;
  }
}