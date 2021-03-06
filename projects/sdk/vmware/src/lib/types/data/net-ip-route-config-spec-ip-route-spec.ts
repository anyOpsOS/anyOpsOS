import {DynamicData} from './dynamic-data';

import {NetIpRouteConfigSpecGatewaySpec} from './net-ip-route-config-spec-gateway-spec';

export interface NetIpRouteConfigSpecIpRouteSpec extends DynamicData {
  gateway: NetIpRouteConfigSpecGatewaySpec;
  network: string;
  operation: string;
  prefixLength: number;
}