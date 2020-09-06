import socketControllers from 'socket-controllers';
import fetch, { Response } from 'node-fetch';
import validator from 'validator';

// TODO ESM
const { getSocketIO } = socketControllers;

import { AnyOpsOSSysWorkspaceModule } from '@anyopsos/module-sys-workspace';
import { AnyOpsOSConfigFileModule } from '@anyopsos/module-config-file';
import { AnyOpsOSCredentialModule } from '@anyopsos/module-credential';

import { ConnectionNetapp } from './types/connection-netapp';
import { ConnectionNetappServer } from './types/connection-netapp-server';
import { WorkspaceToNetappMap } from './types/workspace-to-netapp-map';

import { NETAPP_CONFIG_FILE, NETAPP_PORT, NETAPP_SOAP_COOKIE } from './anyopsos-module-node-netapp.constants';


const netappSessions: WorkspaceToNetappMap = {};

export class AnyOpsOSNodeNetappSessionStateModule {

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

  /**
   * Creates a new NetApp session
   */
  // TODO SSH hopServer?
  async createSession(): Promise<string> {
    if (!netappSessions[this.workspaceUuid]) netappSessions[this.workspaceUuid] = {};

    // Connect
    const connectResponse: Response = await this.connectSoapApi();

    if (!connectResponse.ok) throw new Error(connectResponse.statusText);
    if (!connectResponse.headers.raw()['set-cookie'] && connectResponse.headers.raw()['set-cookie'][0].startsWith(NETAPP_SOAP_COOKIE)) throw new Error('resource_invalid');

    // Set connection as ready
    const connectionData: ConnectionNetapp = await this.getConnection();
    connectionData.state = 'connected';

    // Send data to users
    this.ConfigFileModule.patch(NETAPP_CONFIG_FILE, connectionData, this.connectionUuid);
    getSocketIO().to(this.workspaceUuid).emit('[netapp-data]', {
      connectionUuid: this.connectionUuid,
      data: {
        op: 'patch',
        uuid: connectionData.uuid,
        data: {
          state: 'connected'
        }
      }
    });

    // Store session cookie
    netappSessions[this.workspaceUuid][this.connectionUuid] = connectResponse.headers.raw()['set-cookie'][0];
    return netappSessions[this.workspaceUuid][this.connectionUuid];
  }

  async disconnectSession(): Promise<void> {
    // TODO
  }

  /**
   * Returns a NetApp session SOAP cookie
   */
  getSession(): string {
    if (!netappSessions[this.workspaceUuid]?.[this.connectionUuid]) throw new Error('resource_invalid');

    return netappSessions[this.workspaceUuid][this.connectionUuid];
  }

  /**
   * Returns the connection data from workspaceUuid & connectionUuid
   */
  async getConnection(): Promise<ConnectionNetapp> {
    return this.ConfigFileModule.get(NETAPP_CONFIG_FILE, this.connectionUuid) as Promise<ConnectionNetapp>;
  }

  /**
   * Returns the connection data from workspaceUuid & connectionUuid
   */
  async getConnectionMainServer(): Promise<ConnectionNetappServer> {
    const connectionData: ConnectionNetapp = await this.getConnection();

    return {
      host: connectionData.host,
      port: (validator.isInt(connectionData.port.toString(), { min: 1, max: 65535 }) && connectionData.port) || NETAPP_PORT,
      credential: await this.CredentialModule.getCredential(connectionData.credential)
    };

  }

  /**
   * Starts a session connecting to a NetApp node
   */
  // TODO
  async connectSoapApi(): Promise<Response> {
    const mainServer: ConnectionNetappServer = await this.getConnectionMainServer();

    const proto: string = (mainServer.port === 80 ? 'http' : 'https');
    const xml = `unknown>`;

    const requestHeaders: { [key: string]: string } = {
      'Content-Type': 'text/xml',
      SOAPAction: 'urn:vim25/6.0',
      'Content-Length': Buffer.byteLength(xml).toString(),
      Expect: '100-continue'
    };

    return fetch(`${proto}://${mainServer.host}:${mainServer.port}/sdk`, {
      method: 'POST',
      body: xml,
      headers: requestHeaders
    })
      .then((res: Response) => res)
      .catch(e => e);

  }

}
