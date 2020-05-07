import { KubeObject } from './kube-object';
import { PodContainer } from './pod-container';

export interface CronJob extends KubeObject {
  kind: 'CronJob'
  apiVersion: string
  metadata: {
    name: string;
    namespace: string;
    selfLink: string;
    uid: string;
    resourceVersion: string;
    creationTimestamp: string;
    labels: {
      [key: string]: string;
    };
    annotations: {
      [key: string]: string;
    };
  }
  spec: {
    schedule: string;
    concurrencyPolicy: string;
    suspend: boolean;
    jobTemplate: {
      metadata: {
        creationTimestamp?: string;
      };
      spec: {
        template: {
          metadata: {
            creationTimestamp?: string;
          };
          spec: {
            containers: PodContainer[];
            restartPolicy: string;
            terminationGracePeriodSeconds: number;
            dnsPolicy: string;
            hostPID: boolean;
            schedulerName: string;
          };
        };
      };
    };
    successfulJobsHistoryLimit: number;
    failedJobsHistoryLimit: number;
  }
  status: {
    lastScheduleTime: string;
  }
}