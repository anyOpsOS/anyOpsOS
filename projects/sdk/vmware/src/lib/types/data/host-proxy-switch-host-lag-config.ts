import {DynamicData} from './dynamic-data';

import {KeyValue} from './key-value';

export interface HostProxySwitchHostLagConfig extends DynamicData {
  lagKey: string;
  lagName?: string;
  uplinkPort?: KeyValue[];
}