import {DynamicData} from './dynamic-data';


export interface VirtualMachineCapability extends DynamicData {
  bootOptionsSupported: boolean;
  bootRetryOptionsSupported: boolean;
  changeTrackingSupported: boolean;
  consolePreferencesSupported: boolean;
  cpuFeatureMaskSupported: boolean;
  disableSnapshotsSupported: boolean;
  diskOnlySnapshotOnSuspendedVMSupported?: boolean;
  diskSharesSupported: boolean;
  featureRequirementSupported: boolean;
  guestAutoLockSupported: boolean;
  hostBasedReplicationSupported: boolean;
  lockSnapshotsSupported: boolean;
  memoryReservationLockSupported: boolean;
  memorySnapshotsSupported: boolean;
  multipleCoresPerSocketSupported: boolean;
  multipleSnapshotsSupported: boolean;
  nestedHVSupported: boolean;
  npivWwnOnNonRdmVmSupported: boolean;
  perVmEvcSupported?: boolean;
  poweredOffSnapshotsSupported: boolean;
  poweredOnMonitorTypeChangeSupported: boolean;
  quiescedSnapshotsSupported: boolean;
  recordReplaySupported: boolean;
  revertToSnapshotSupported: boolean;
  s1AcpiManagementSupported: boolean;
  secureBootSupported?: boolean;
  seSparseDiskSupported: boolean;
  settingDisplayTopologySupported: boolean;
  settingScreenResolutionSupported: boolean;
  settingVideoRamSizeSupported: boolean;
  snapshotConfigSupported: boolean;
  snapshotOperationsSupported: boolean;
  swapPlacementSupported: boolean;
  toolsAutoUpdateSupported: boolean;
  toolsSyncTimeSupported: boolean;
  virtualExecUsageIgnored?: boolean;
  virtualMmuUsageIgnored?: boolean;
  virtualMmuUsageSupported: boolean;
  vmNpivWwnDisableSupported: boolean;
  vmNpivWwnSupported: boolean;
  vmNpivWwnUpdateSupported: boolean;
  vPMCSupported: boolean;
}