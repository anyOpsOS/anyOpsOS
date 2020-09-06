import { PolicySelector } from './policy-selector';
import { PolicyIpBlock } from './policy-ip-block';

export interface PolicyIngress {
  from: {
    ipBlock?: PolicyIpBlock;
    namespaceSelector?: PolicySelector;
    podSelector?: PolicySelector;
  }[];
  ports: {
    protocol: string;
    port: number;
  }[];
}