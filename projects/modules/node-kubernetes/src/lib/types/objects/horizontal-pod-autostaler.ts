import { HpaMetric } from './hpa-metric';
import { KubeObject } from './kube-object';

export interface HorizontalPodAutoscaler extends KubeObject {
  kind: 'HorizontalPodAutoscaler';
  spec: {
    scaleTargetRef: {
      kind: string;
      name: string;
      apiVersion: string;
    };
    minReplicas: number;
    maxReplicas: number;
    metrics: HpaMetric[];
  };
  status: {
    currentReplicas: number;
    desiredReplicas: number;
    currentMetrics: HpaMetric[];
    conditions: {
      lastTransitionTime: string;
      message: string;
      reason: string;
      status: string;
      type: string;
    }[];
  };
}