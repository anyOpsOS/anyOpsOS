import {WorkloadKubeObject} from './workload-kube-object';
import {PodContainer} from './pod-container';
import {Affinity} from './affinity';

export interface ReplicaSet extends WorkloadKubeObject {
  kind: 'ReplicaSet';
  spec: {
    replicas?: number;
    selector?: {
      matchLabels: {
        [key: string]: string;
      };
    };
    containers?: PodContainer[];
    template?: {
      spec?: {
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
        containers: PodContainer[];
      };
    };
    restartPolicy?: string;
    terminationGracePeriodSeconds?: number;
    dnsPolicy?: string;
    schedulerName?: string;
  }
  status: {
    replicas: number;
    fullyLabeledReplicas: number;
    readyReplicas: number;
    availableReplicas: number;
    observedGeneration: number;
  }
}