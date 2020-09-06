import { KubeObject } from './kube-object';

export interface PodSecurityPolicy extends KubeObject {
  kind: 'PodSecurityPolicy';
  spec: {
    allowPrivilegeEscalation?: boolean;
    allowedCSIDrivers?: {
      name: string;
    }[];
    allowedCapabilities: string[];
    allowedFlexVolumes?: {
      driver: string;
    }[];
    allowedHostPaths?: {
      pathPrefix: string;
      readOnly: boolean;
    }[];
    allowedProcMountTypes?: string[];
    allowedUnsafeSysctls?: string[];
    defaultAddCapabilities?: string[];
    defaultAllowPrivilegeEscalation?: boolean;
    forbiddenSysctls?: string[];
    fsGroup?: {
      rule: string;
      ranges: { max: number; min: number }[];
    };
    hostIPC?: boolean;
    hostNetwork?: boolean;
    hostPID?: boolean;
    hostPorts?: {
      max: number;
      min: number;
    }[];
    privileged?: boolean;
    readOnlyRootFilesystem?: boolean;
    requiredDropCapabilities?: string[];
    runAsGroup?: {
      ranges: { max: number; min: number }[];
      rule: string;
    };
    runAsUser?: {
      rule: string;
      ranges: { max: number; min: number }[];
    };
    runtimeClass?: {
      allowedRuntimeClassNames: string[];
      defaultRuntimeClassName: string;
    };
    seLinux?: {
      rule: string;
      seLinuxOptions: {
        level: string;
        role: string;
        type: string;
        user: string;
      };
    };
    supplementalGroups?: {
      rule: string;
      ranges: { max: number; min: number }[];
    };
    volumes?: string[];
  }
}