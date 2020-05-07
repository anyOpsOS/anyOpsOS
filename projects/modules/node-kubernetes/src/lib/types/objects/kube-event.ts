import { KubeObject } from './kube-object';

export interface KubeEvent extends KubeObject {
  kind: 'Event',
  involvedObject: {
    kind: string;
    namespace: string;
    name: string;
    uid: string;
    apiVersion: string;
    resourceVersion: string;
    fieldPath: string;
  }
  reason: string
  message: string
  source: {
    component: string;
    host: string;
  }
  firstTimestamp: string;
  lastTimestamp: string;
  count: number;
  type: string;
  eventTime: null;
  reportingComponent: string;
  reportingInstance: string;
}