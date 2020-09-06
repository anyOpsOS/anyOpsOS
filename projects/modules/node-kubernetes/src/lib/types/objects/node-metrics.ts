import { Metrics } from './metrics';

export interface NodeMetrics<T = Metrics> {
  [metric: string]: T;
  memoryUsage: T;
  memoryCapacity: T;
  cpuUsage: T;
  cpuCapacity: T;
  fsUsage: T;
  fsSize: T;
}