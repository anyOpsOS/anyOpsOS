export interface PolicyIpBlock {
  cidr: string;
  except?: string[];
}