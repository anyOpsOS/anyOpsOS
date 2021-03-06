import { Injectable } from '@angular/core';

import { Socket } from 'ngx-socket-io';

import { AnyOpsOSLibLoggerService } from '@anyopsos/lib-logger';
import { AnyOpsOSLibWorkspaceService } from '@anyopsos/lib-workspace';
import { AnyOpsOSLibSshHelpersService, AnyOpsOSLibSshService } from '@anyopsos/lib-ssh';
import { ConnectionNetapp } from '@anyopsos/module-node-netapp';
import { ConnectionSsh } from '@anyopsos/module-ssh';
import { BackendResponse } from '@anyopsos/backend-core/app/types/backend-response';

import { AnyOpsOSLibNodeNetappConnectionsStateService } from './anyopsos-lib-node-netapp-connections-state.service';
import { AnyOpsOSLibNodeNetappHelpersService } from './anyopsos-lib-node-netapp-helpers.service';

@Injectable({
  providedIn: 'root'
})
export class AnyOpsOSLibNodeNetappService {

  constructor(private readonly socket: Socket,
              private readonly logger: AnyOpsOSLibLoggerService,
              private readonly LibWorkspace: AnyOpsOSLibWorkspaceService,
              private readonly LibNodeNetappConnectionsState: AnyOpsOSLibNodeNetappConnectionsStateService,
              private readonly LibNodeNetapphHelpers: AnyOpsOSLibNodeNetappHelpersService,
              private readonly LibSshHelpers: AnyOpsOSLibSshHelpersService,
              private readonly LibSsh: AnyOpsOSLibSshService) {
  }

  /**
   * Initialize Netapp connection with Backend
   */
  async sendConnect(connectionUuid: string): Promise<void> {
    this.logger.debug('LibNodeNetapp', 'sendConnect -> Connecting...');

    const currentConnection: ConnectionNetapp = await this.LibNodeNetapphHelpers.getConnectionByUuid(connectionUuid);
    if (currentConnection.state === 'connected') throw new Error('already_connected');

    // If current connection have hopServerUuid, make sure it's Online and then Start the current connection
    if (currentConnection.hopServerUuid) {
      await this.LibSsh.sendConnect(currentConnection.hopServerUuid);
      const hopServer: ConnectionSsh = await this.LibSshHelpers.getConnectionByUuid(currentConnection.hopServerUuid, 'ssh') as ConnectionSsh;
      if (hopServer.state === 'disconnected') await this.LibSsh.sendConnect(currentConnection.hopServerUuid);
    }

    // Start current connection
    await this.socketConnectServer(currentConnection);
  }

  /**
   * Send a message to Backend and setups the connection
   */
  private socketConnectServer(connection: ConnectionNetapp): Promise<any> {
    const loggerArgs = arguments;
    this.logger.info('LibNodeNetapp', 'Connecting to socket', loggerArgs);

    return new Promise((resolve, reject) => {

      // Create new Netapp session
      this.socket.emit('[netapp-session]',
                       {
                        connectionUuid: connection.uuid,
                        workspaceUuid: this.LibWorkspace.getCurrentWorkspaceUuid()
                       },
                       async (data: BackendResponse) => {

                        if (data.status === 'error') {
                          this.logger.error('LibNodeNetapp', 'Error while emitting [netapp-session]', loggerArgs, data.data);
                          await this.LibNodeNetappConnectionsState.patchConnection(connection.uuid, 'error', data.data);

                          return reject(data.data);
                        }

                        // Set connection state as connected and remove any previous errors
                        await this.LibNodeNetappConnectionsState.patchConnection(connection.uuid, 'state', 'connected');
                        await this.LibNodeNetappConnectionsState.patchConnection(connection.uuid, 'error', null);

                        return resolve();
                       });
    });
  }

  /**
   * Disconnects a connection
   */
  disconnectConnection(connectionUuid: string): Promise<void> {
    const loggerArgs = arguments;
    this.logger.debug('LibNodeNetapp', 'Disconnecting connection', loggerArgs);

    return new Promise(async (resolve, reject) => {

      const currentConnection: ConnectionNetapp = await this.LibNodeNetapphHelpers.getConnectionByUuid(connectionUuid);
      if (currentConnection.state === 'disconnected') throw new Error('already_disconnected');

      this.socket.emit('[netapp-disconnect]',
                       {
                        connectionUuid,
                        workspaceUuid: this.LibWorkspace.getCurrentWorkspaceUuid()
                       },
                       async (data: BackendResponse) => {

                        if (data.status === 'error') {
                          this.logger.error('LibNodeNetapp', 'Error while emitting [netapp-disconnect]', loggerArgs, data.data);
                          await this.LibNodeNetappConnectionsState.patchConnection(connectionUuid, 'error', data.data);

                          return reject(data.data);
                        }

                        // Set connection state as connected and remove any previous errors
                        await this.LibNodeNetappConnectionsState.patchConnection(connectionUuid, 'state', 'disconnected');
                        await this.LibNodeNetappConnectionsState.patchConnection(connectionUuid, 'error', null);

                        return resolve();
                       });
    });
  }

  /**
   * Deletes a connection
   */
  deleteConnection(connectionUuid: string): Promise<void> {
    const loggerArgs = arguments;
    this.logger.debug('LibNodeNetapp', 'Deleting connection', arguments);

    return new Promise(async (resolve, reject) => {

      const currentConnection: ConnectionNetapp = await this.LibNodeNetapphHelpers.getConnectionByUuid(connectionUuid);
      if (!currentConnection) {
        this.logger.error('LibNodeNetapp', 'deleteConnection -> Resource invalid', loggerArgs);
        throw new Error('resource_invalid');
      }

      if (currentConnection.state === 'connected') await this.disconnectConnection(connectionUuid);

      this.LibNodeNetappConnectionsState.deleteConnection(connectionUuid).then(() => {
        return resolve();
      }).catch((e: any) => {
        return reject(e);
      });
    });
  }
}
