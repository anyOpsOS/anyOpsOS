import {KubeObject} from './kube-object';

export interface PodMetrics extends KubeObject {
  timestamp: string
  window: string
  containers: {
    name: string;
    usage: {
      cpu: string;
      memory: string;
    };
  }[]
}