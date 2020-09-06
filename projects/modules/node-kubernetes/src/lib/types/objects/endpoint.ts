import { EndpointSubset } from './endpoint-subset';
import { KubeObject } from './kube-object';

export interface Endpoint extends KubeObject {
  kind: 'Endpoint';
  subsets: EndpointSubset[];
}