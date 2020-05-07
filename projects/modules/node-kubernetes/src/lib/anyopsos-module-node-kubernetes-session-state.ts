import socketControllers from 'socket-controllers';
import k8sClientNode, {KubeConfig as IKubeConfig} from '@kubernetes/client-node';
import {Cluster, User} from '@kubernetes/client-node/dist/config_types';
import log4js, {Logger} from 'log4js';

// TODO ESM
const {getSocketIO} = socketControllers;
const {KubeConfig} = k8sClientNode;
const {getLogger} = log4js;

import {AnyOpsOSSysWorkspaceModule} from '@anyopsos/module-sys-workspace';
import {AnyOpsOSConfigFileModule} from '@anyopsos/module-config-file';
import {AnyOpsOSCredentialModule} from '@anyopsos/module-credential';

import {ConnectionKubernetesServer} from './types/connection-kubernetes-server';
import {ConnectionKubernetes} from './types/connection-kubernetes';
import {WorkspaceToKubernetesMap} from './types/workspace-to-kubernetes-map';

import {KUBERNETES_CONFIG_FILE} from './anyopsos-module-node-kubernetes.constants';

const logger: Logger = getLogger('mainLog');
const kubernetesSessions: WorkspaceToKubernetesMap = {};

export class AnyOpsOSNodeKubernetesSessionStateModule {

  private readonly WorkspaceModule: AnyOpsOSSysWorkspaceModule;
  private readonly ConfigFileModule: AnyOpsOSConfigFileModule;
  private readonly CredentialModule: AnyOpsOSCredentialModule;

  constructor(private readonly userUuid: string,
              private readonly workspaceUuid: string,
              private readonly connectionUuid: string) {

    this.WorkspaceModule = new AnyOpsOSSysWorkspaceModule(this.userUuid);
    this.ConfigFileModule = new AnyOpsOSConfigFileModule(this.userUuid, this.workspaceUuid);
    this.CredentialModule = new AnyOpsOSCredentialModule(this.userUuid, this.workspaceUuid);
  }

  async createSession(): Promise<IKubeConfig> {
    logger.trace(`[Module Kubernetes Session State] -> createSession -> userUuid [${this.userUuid}], workspaceUuid [${this.workspaceUuid}], connectionUuid [${this.connectionUuid}]`);

    if (!kubernetesSessions[this.workspaceUuid]) kubernetesSessions[this.workspaceUuid] = {};

    const mainServer: ConnectionKubernetesServer = await this.getConnectionMainServer();

    const cluster: Cluster = {
      name: mainServer.clusterName,
      server: mainServer.clusterServer,
      caData: mainServer.clusterCa,
      skipTLSVerify: false
    };

    // TODO
    const user: User = {
      name: 'someName',
      token: mainServer.credential.password
    };

    const kc: IKubeConfig = new KubeConfig();
    kc.loadFromClusterAndUser(cluster, user);

    // Set connection as ready
    const connectionData: ConnectionKubernetes = await this.getConnection();
    connectionData.state = 'connected';

    // Send data to users
    this.ConfigFileModule.patch(KUBERNETES_CONFIG_FILE, connectionData, this.connectionUuid);
    getSocketIO().to(this.workspaceUuid).emit('[kubernetes-data]', {
      connectionUuid: this.connectionUuid,
      data: {
        op: 'patch',
        uuid: connectionData.uuid,
        data: {
          state: 'connected'
        }
      }
    });

    kubernetesSessions[this.workspaceUuid][this.connectionUuid] = kc;
    return kubernetesSessions[this.workspaceUuid][this.connectionUuid];
  }

  async disconnectSession(): Promise<void> {
    logger.trace(`[Module Kubernetes Session State] -> disconnectSession -> userUuid [${this.userUuid}], workspaceUuid [${this.workspaceUuid}], connectionUuid [${this.connectionUuid}]`);
    // TODO
    // return kubernetesSessions[this.workspaceUuid][this.connectionUuid].close();
  }

  /**
   * Returns a Kubernetes session
   */
  getSession(): IKubeConfig {
    logger.trace(`[Module Kubernetes Session State] -> disconnectSession -> userUuid [${this.userUuid}], workspaceUuid [${this.workspaceUuid}], connectionUuid [${this.connectionUuid}]`);

    if (!kubernetesSessions[this.workspaceUuid]?.[this.connectionUuid]) throw new Error('resource_invalid');

    return kubernetesSessions[this.workspaceUuid][this.connectionUuid];
  }

  /**
   * Returns the connection data from workspaceUuid & connectionUuid
   */
  async getConnection(): Promise<ConnectionKubernetes> {
    logger.trace(`[Module Kubernetes Session State] -> getConnection -> userUuid [${this.userUuid}], workspaceUuid [${this.workspaceUuid}], connectionUuid [${this.connectionUuid}]`);

    return this.ConfigFileModule.get(KUBERNETES_CONFIG_FILE, this.connectionUuid) as Promise<ConnectionKubernetes>;
  }

  /**
   * Returns the connection data from workspaceUuid & connectionUuid
   */
  async getConnectionMainServer(): Promise<ConnectionKubernetesServer> {
    logger.trace(`[Module Kubernetes Session State] -> getConnectionMainServer -> userUuid [${this.userUuid}], workspaceUuid [${this.workspaceUuid}], connectionUuid [${this.connectionUuid}]`);

    const connectionData: ConnectionKubernetes = await this.getConnection();

    return {
      clusterName: connectionData.clusterName,
      clusterServer: connectionData.clusterServer,
      clusterCa: connectionData.clusterCa,
      credential: await this.CredentialModule.getCredential(connectionData.credential)
    };

  }

}
