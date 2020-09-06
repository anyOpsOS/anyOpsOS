import { ConnectionDocker } from '@anyopsos/module-node-docker';
import { ConnectionKubernetes } from '@anyopsos/module-node-kubernetes';
import { ConnectionLinux } from '@anyopsos/module-node-linux';
import { ConnectionNetapp } from '@anyopsos/module-node-netapp';
import { ConnectionSnmp } from '@anyopsos/module-node-snmp';
import { ConnectionVmware } from '@anyopsos/module-node-vmware';

export type ConnectionTypes = ConnectionKubernetes | ConnectionDocker | ConnectionLinux | ConnectionNetapp | ConnectionSnmp | ConnectionVmware;
