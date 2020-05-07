export type HpaMetricData<T = any> = T & {
  target?: {
    kind: string;
    name: string;
    apiVersion: string;
  };
  name?: string;
  metricName?: string;
  currentAverageUtilization?: number;
  currentAverageValue?: string;
  targetAverageUtilization?: number;
  targetAverageValue?: string;
}