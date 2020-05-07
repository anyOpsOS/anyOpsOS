import {WorkloadKubeObject} from './workload-kube-object';
import {PodContainer} from './pod-container';
import {PodContainerStatus} from './pod-container-status';
import {Affinity} from './affinity';

export interface Pod extends WorkloadKubeObject {
  kind: 'Pod',
  spec: {
    volumes?: {
      name: string;
      persistentVolumeClaim: {
        claimName: string;
      };
      secret: {
        secretName: string;
        defaultMode: number;
      };
    }[];
    initContainers: PodContainer[];
    containers: PodContainer[];
    restartPolicy: string;
    terminationGracePeriodSeconds: number;
    dnsPolicy: string;
    serviceAccountName: string;
    serviceAccount: string;
    priority: number;
    priorityClassName: string;
    nodeName: string;
    nodeSelector?: {
      [selector: string]: string;
    };
    securityContext: {};
    schedulerName: string;
    tolerations: {
      key: string;
      operator: string;
      effect: string;
      tolerationSeconds: number;
    }[];
    affinity: Affinity;
  }
  status: {
    phase: string;
    conditions: {
      type: string;
      status: string;
      lastProbeTime: number;
      lastTransitionTime: string;
    }[];
    hostIP: string;
    podIP: string;
    startTime: string;
    initContainerStatuses?: PodContainerStatus[];
    containerStatuses?: PodContainerStatus[];
    qosClass: string;
    reason?: string;
  }
}