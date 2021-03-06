import {DynamicData} from './dynamic-data';

import {DVSContactInfo} from './d-v-s-contact-info';
import {DVPortSetting} from './d-v-port-setting';
import {DistributedVirtualSwitchHostMemberConfigSpec} from './distributed-virtual-switch-host-member-config-spec';
import {DvsHostInfrastructureTrafficResource} from './dvs-host-infrastructure-traffic-resource';
import {DVSPolicy} from './d-v-s-policy';
import {ManagedObjectReference} from './managed-object-reference';
import {DVSUplinkPortPolicy} from './d-v-s-uplink-port-policy';
import {DistributedVirtualSwitchKeyedOpaqueBlob} from './distributed-virtual-switch-keyed-opaque-blob';

export interface DVSConfigSpec extends DynamicData {
  configVersion?: string;
  contact?: DVSContactInfo;
  defaultPortConfig?: DVPortSetting;
  defaultProxySwitchMaxNumPorts?: number;
  description?: string;
  extensionKey?: string;
  host?: DistributedVirtualSwitchHostMemberConfigSpec[];
  infrastructureTrafficResourceConfig?: DvsHostInfrastructureTrafficResource[];
  maxPorts?: number;
  name?: string;
  netResourcePoolTrafficResourceConfig?: DvsHostInfrastructureTrafficResource[];
  networkResourceControlVersion?: string;
  numStandalonePorts?: number;
  policy?: DVSPolicy;
  switchIpAddress?: string;
  uplinkPortgroup?: ManagedObjectReference & { $type: 'DistributedVirtualPortgroup[]'; };
  uplinkPortPolicy?: DVSUplinkPortPolicy;
  vendorSpecificConfig?: DistributedVirtualSwitchKeyedOpaqueBlob[];
}