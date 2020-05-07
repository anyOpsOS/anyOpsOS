export interface ResourceQuotaValues {
  [quota: string]: string | undefined; // TODO remove undefined

  // Compute Resource Quota
  'limits.cpu'?: string;
  'limits.memory'?: string;
  'requests.cpu'?: string;
  'requests.memory'?: string;

  // Storage Resource Quota
  'requests.storage'?: string;
  'persistentvolumeclaims'?: string;

  // Object Count Quota
  'count/pods'?: string;
  'count/persistentvolumeclaims'?: string;
  'count/services'?: string;
  'count/secrets'?: string;
  'count/configmaps'?: string;
  'count/replicationcontrollers'?: string;
  'count/deployments.apps'?: string;
  'count/replicasets.apps'?: string;
  'count/statefulsets.apps'?: string;
  'count/jobs.batch'?: string;
  'count/cronjobs.batch'?: string;
  'count/deployments.extensions'?: string;
}