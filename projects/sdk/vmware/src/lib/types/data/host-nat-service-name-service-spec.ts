import {DynamicData} from './dynamic-data';


export interface HostNatServiceNameServiceSpec extends DynamicData {
  dnsAutoDetect: boolean;
  dnsNameServer?: string[];
  dnsPolicy: string;
  dnsRetries: number;
  dnsTimeout: number;
  nbdsTimeout: number;
  nbnsRetries: number;
  nbnsTimeout: number;
}