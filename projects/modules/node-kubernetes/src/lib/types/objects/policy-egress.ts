import {PolicyIpBlock} from './policy-ip-block';

export interface PolicyEgress {
  to: {
    ipBlock: PolicyIpBlock;
  }[];
  ports: {
    protocol: string;
    port: number;
  }[];
}