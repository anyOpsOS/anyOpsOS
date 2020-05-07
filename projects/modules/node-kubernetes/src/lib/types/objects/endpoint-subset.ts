import {EndpointPort} from './endpoint-port';
import {EndpointAddress} from './endpoint-address';

export interface EndpointSubset {
  addresses: EndpointAddress[];
  notReadyAddresses: EndpointAddress[];
  ports: EndpointPort[];
}