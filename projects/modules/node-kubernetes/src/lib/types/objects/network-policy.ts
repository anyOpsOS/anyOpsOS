import {PolicyEgress} from './policy-egress';
import {PolicyIngress} from './policy-ingress';
import {KubeObject} from './kube-object';

export interface NetworkPolicy extends KubeObject {
  kind: 'NetworkPolicy';
  spec: {
    podSelector: {
      matchLabels: {
        [label: string]: string;
        role: string;
      };
    };
    policyTypes: string[];
    ingress: PolicyIngress[];
    egress: PolicyEgress[];
  }
}