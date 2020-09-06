import { Metrics } from './metrics';

export interface PvcMetrics<T = Metrics> {
  [key: string]: T;
  diskUsage: T;
  diskCapacity: T;
}