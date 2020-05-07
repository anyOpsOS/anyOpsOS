import { NodeAffinity } from './node-affinity';
import { PodAffinity } from './pod-affinity';

export interface Affinity {
  nodeAffinity?: {
    requiredDuringSchedulingIgnoredDuringExecution?: NodeAffinity[];
    preferredDuringSchedulingIgnoredDuringExecution?: NodeAffinity[];
  };
  podAffinity?: {
    requiredDuringSchedulingIgnoredDuringExecution?: PodAffinity[];
    preferredDuringSchedulingIgnoredDuringExecution?: PodAffinity[];
  };
  podAntiAffinity?: {
    requiredDuringSchedulingIgnoredDuringExecution?: PodAffinity[];
    preferredDuringSchedulingIgnoredDuringExecution?: PodAffinity[];
  };
}