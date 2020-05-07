import {MetricsResult} from './metrics-result';

export interface Metrics {
  status: string;
  data: {
    resultType: string;
    result: MetricsResult[];
  };
}