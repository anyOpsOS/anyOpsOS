import {DynamicData} from './dynamic-data';

import {CryptoKeyId} from './crypto-key-id';
import {ToolsConfigInfoToolsLastInstallInfo} from './tools-config-info-tools-last-install-info';

export interface ToolsConfigInfo extends DynamicData {
  afterPowerOn?: boolean;
  afterResume?: boolean;
  beforeGuestReboot?: boolean;
  beforeGuestShutdown?: boolean;
  beforeGuestStandby?: boolean;
  customizationKeyId?: CryptoKeyId;
  lastInstallInfo?: ToolsConfigInfoToolsLastInstallInfo;
  pendingCustomization?: string;
  syncTimeWithHost?: boolean;
  toolsInstallType?: string;
  toolsUpgradePolicy?: string;
  toolsVersion?: number;
}