import {HpaMetricType} from './hpa-metric-type';
import {HpaMetricData} from './hpa-metric-data';

export interface HpaMetric {
  [kind: string]: HpaMetricData;

  type: HpaMetricType;
  resource?: HpaMetricData<{ name: string }>;
  pods?: HpaMetricData;
  external?: HpaMetricData;
  object?: HpaMetricData<{
    describedObject: {
      apiVersion: string;
      kind: string;
      name: string;
    };
  }>;
}