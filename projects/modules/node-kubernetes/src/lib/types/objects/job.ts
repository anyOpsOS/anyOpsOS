import { WorkloadKubeObject } from './workload-kube-object';
import { PodContainer } from './pod-container';
import { Affinity } from './affinity';

export interface Job extends WorkloadKubeObject {
  kind: 'Job';
  spec: {
    parallelism?: number;
    completions?: number;
    backoffLimit?: number;
    selector: {
      matchLabels: {
        [name: string]: string;
      };
    };
    template: {
      metadata: {
        creationTimestamp?: string;
        labels: {
          name: string;
        };
      };
      spec: {
        containers: PodContainer[];
        restartPolicy: string;
        terminationGracePeriodSeconds: number;
        dnsPolicy: string;
        hostPID: boolean;
        affinity?: Affinity;
        nodeSelector?: {
          [selector: string]: string;
        };
        tolerations: {
          key: string;
          operator: string;
          effect: string;
          tolerationSeconds: number;
        }[];
        schedulerName: string;
      };
    };
    containers?: PodContainer[];
    restartPolicy?: string;
    terminationGracePeriodSeconds?: number;
    dnsPolicy?: string;
    serviceAccountName?: string;
    serviceAccount?: string;
    schedulerName?: string;
  }
  status: {
    conditions: {
      type: string;
      status: string;
      lastProbeTime: string;
      lastTransitionTime: string;
      message?: string;
    }[];
    startTime: string;
    completionTime: string;
    succeeded: number;
  }
}