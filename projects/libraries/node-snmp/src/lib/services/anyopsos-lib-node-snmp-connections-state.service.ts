import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AnyOpsOSLibLoggerService } from '@anyopsos/lib-logger';
import { AnyOpsOSLibFileSystemService } from '@anyopsos/lib-file-system';
import { ConnectionSnmp } from '@anyopsos/module-node-snmp';
import { BackendResponse } from '@anyopsos/backend-core/app/types/backend-response';

// TODO extract it from '@anyopsos/module-node-snmp'
const SNMP_CONFIG_FILE = 'snmp.json';

@Injectable({
  providedIn: 'root'
})
export class AnyOpsOSLibNodeSnmpConnectionsStateService {
  private connectionsInitialized: boolean = false;

  readonly $connections: BehaviorSubject<ConnectionSnmp[]>;
  private dataStore: {
    connections: ConnectionSnmp[];
  };
  readonly connections: Observable<ConnectionSnmp[]>;

  constructor(private readonly logger: AnyOpsOSLibLoggerService,
              private readonly LibFileSystem: AnyOpsOSLibFileSystemService) {

    this.dataStore = { connections: [] };
    this.$connections = new BehaviorSubject(this.dataStore.connections);
    this.connections = this.$connections.asObservable();
  }

  /**
   * Setter & Getter of connectionsInitialized
   * This variable ensures Snmp connections are loaded only once
   */
  setConnectionsInitialized(): void {
    if (this.connectionsInitialized === true) {

      this.logger.error('LibNodeSnmp', 'setConnectionsInitialized -> Connections already initialized');
      throw new Error('already_initialized');
    }

    this.connectionsInitialized = true;
  }

  getConnectionsInitialized(): boolean {
    return this.connectionsInitialized;
  }

  /**
   * Called by Module when the library loads.
   * Sets the initial state.
   */
  initConnections(): void {
    if (this.getConnectionsInitialized()) throw new Error('connections_already_initialized');

    this.LibFileSystem.getConfigFile(SNMP_CONFIG_FILE).subscribe(
      (connectionsData: BackendResponse & { data: ConnectionSnmp[]; }) => {
        if (connectionsData.status === 'error') {
          this.logger.error('LibNodeSnmp', 'Error while initializing connections', null, connectionsData.data);
          throw connectionsData.data;
        }

        this.setConnectionsInitialized();

        // Update state
        connectionsData.data.forEach((connection: ConnectionSnmp) => this.putConnection(connection, false));
      },
      async (error) => {

        // If config file not exist, create a new one and try again
        if (error.data === 'resource_not_found') {

          await this.LibFileSystem.putConfigFile([], SNMP_CONFIG_FILE).subscribe(
            (res: BackendResponse) => {
              if (res.status === 'error') throw res.data;

              return this.initConnections();
            },
            err => {
              this.logger.error('LibNodeSnmp', 'Error while getting connections', null, err);
              this.logger.error('LibNodeSnmp', 'Error while creating configuration file', null, err);
            });
        } else {
          this.logger.error('LibNodeSnmp', 'Error while getting connections', null, error);
        }

      });

  }

  /**
   * Updates the current state with a new connection
   */
  putConnection(connection: ConnectionSnmp, saveConnection: boolean = true): Promise<void> {
    this.logger.debug('LibNodeSnmp', 'New connection received', arguments);

    const connectionExists: ConnectionSnmp = this.dataStore.connections.find((conn: ConnectionSnmp) => conn.uuid === connection.uuid);
    if (connectionExists) {
      this.logger.error('LibNodeSnmp', 'putConnection -> Resource already exists', arguments);
      throw new Error('resource_already_exists');
    }

    if (!connection.data) {
      connection.data = {
        Base: {
          name: ''
        },
        Data: []
      }
    }

    this.dataStore.connections.push(connection);

    // broadcast data to subscribers
    this.$connections.next(Object.assign({}, this.dataStore).connections);

    if (!saveConnection) return;
    return this.saveBackend(connection, 'put');
  }

  /**
   * Updates a connection state
   */
  patchConnection(connectionUuid: string, param: string, data: any): Promise<void> {
    const connectionIndex: number = this.dataStore.connections.findIndex((conn: ConnectionSnmp) => conn.uuid === connectionUuid);
    if (connectionIndex === -1) {
      this.logger.error('LibNodeSnmp', 'patchConnection -> Resource invalid', arguments);
      throw new Error('resource_invalid');
    }

    this.dataStore.connections[connectionIndex][param] = data;

    // broadcast data to subscribers
    this.$connections.next(Object.assign({}, this.dataStore).connections);

    return this.saveBackend(this.dataStore.connections[connectionIndex], 'patch');
  }

  patchFullConnection(connection: ConnectionSnmp): Promise<void> {
    const connectionIndex: number = this.dataStore.connections.findIndex((conn: ConnectionSnmp) => conn.uuid === connection.uuid);
    if (connectionIndex === -1) {
      this.logger.error('LibNodeSnmp', 'patchFullConnection -> Resource invalid', arguments);
      throw new Error('resource_invalid');
    }

    if (!connection.data) {
      connection.data = {
        Base: {
          name: ''
        },
        Data: []
      }
    }

    this.dataStore.connections[connectionIndex] = connection;

    // broadcast data to subscribers
    this.$connections.next(Object.assign({}, this.dataStore).connections);

    return this.saveBackend(this.dataStore.connections[connectionIndex], 'patch');
  }

  /**
   * Deletes a connection from state
   */
  deleteConnection(connectionUuid: string): Promise<void> {
    const currentConnection: ConnectionSnmp = this.dataStore.connections.find((connection: ConnectionSnmp) => connection.uuid === connectionUuid);
    if (!currentConnection) {
      this.logger.error('LibNodeSnmp', 'deleteConnection -> Resource invalid', arguments);
      throw new Error('resource_invalid');
    }

    this.dataStore.connections = this.dataStore.connections.filter((connection: ConnectionSnmp) => connection.uuid !== connectionUuid);

    // broadcast data to subscribers
    this.$connections.next(Object.assign({}, this.dataStore).connections);

    return this.saveBackend(currentConnection, 'delete');
  }

  /**
   * Saves current state persistently
   */
  private saveBackend(currentConnection: ConnectionSnmp, type: 'put' | 'patch' | 'delete'): Promise<void> {
    const loggerArgs = arguments;

    return new Promise(async (resolve, reject) => {

      let fileSystemObservable: Observable<{ [key: string]: any }>;

      if (type === 'put') fileSystemObservable = this.LibFileSystem.putConfigFile(currentConnection, SNMP_CONFIG_FILE, currentConnection.uuid);
      if (type === 'patch') fileSystemObservable = this.LibFileSystem.patchConfigFile(currentConnection, SNMP_CONFIG_FILE, currentConnection.uuid);
      if (type === 'delete') fileSystemObservable = this.LibFileSystem.deleteConfigFile(SNMP_CONFIG_FILE, currentConnection.uuid);

      fileSystemObservable.subscribe((res: BackendResponse) => {
        if (res.status === 'error') {
          this.logger.error('LibNodeSnmp', 'Error while saving connection', null, res.data);
          return reject(res.data);
        }

        this.logger.debug('LibNodeSnmp', 'Saved connection successfully', loggerArgs);
        return resolve(res.data);
      },
                                     error => {
          this.logger.error('LibNodeSnmp', 'Error while saving connection', loggerArgs, error);
          return reject(error);
        });
    });
  }

}
