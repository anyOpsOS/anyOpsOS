import {join} from 'path';
import {client} from 'node-vault';
import log4js, {Logger} from 'log4js';
import uuid from 'uuid';

// TODO ESM
const {getLogger} = log4js;
const {v4} = uuid;

import {AnyOpsOSVaultModule} from '@anyopsos/module-vault';
import {AnyOpsOSFileSystemModule} from '@anyopsos/module-file-system';
import {AnyOpsOSConfigFileModule} from '@anyopsos/module-config-file';

import {ApiCaller} from './decorators/api-caller'

import {Workspace} from './types/workspace';


const logger: Logger = getLogger('auth');

// TODO validate inputs for uuid only contain [A-Za-z0-9\-]
export class AnyOpsOSSysWorkspaceModule {

  private readonly VaultModule: AnyOpsOSVaultModule = new AnyOpsOSVaultModule();
  private readonly vaultClient: client = this.VaultModule.getVaultClient();

  constructor(private readonly userUuid: string) {

  }

  private async getWorkspaces(): Promise<string[]> {
    logger.trace(`[Module Workspace] -> getWorkspaces`);

    return await this.vaultClient.list(`secret/workspaces/`).then(request => request.data.keys);
  }

  async createWorkspace(name: string, path: string, isDefault: boolean = false): Promise<void> {
    logger.trace(`[Module Workspace] -> createWorkspace name [${name}], path [${path}], isDefault [${isDefault}]`);

    const workspaceUuid: string = v4();

    const FileSystemModule: AnyOpsOSFileSystemModule = new AnyOpsOSFileSystemModule(this.userUuid);
    const ConfigFileModule: AnyOpsOSConfigFileModule = new AnyOpsOSConfigFileModule(this.userUuid, workspaceUuid);

    await this.vaultClient.write(`secret/workspaces/${workspaceUuid}`, { name, owner: this.userUuid, path, default: isDefault });
    await FileSystemModule.putFolder(join(path, 'etc'));
    await ConfigFileModule.put(`task_bar.json`, []);
  }

  @ApiCaller()
  async getWorkspacesDetails(): Promise<Workspace[]> {
    logger.trace(`[Module Workspace] -> getWorkspacesDetails`);

    return this.getWorkspaces().then(async (workspaces: string[]) => {

      console.log(workspaces);

      // Do not check entrys ending with '/' since they are the workspace entity containing the credentials
      return Promise.all(workspaces.filter(w => !w.endsWith('/')).map(async (workspaceUuid: string) => {

        return {
          ...await this.getWorkspaceByUuid(workspaceUuid),
          workspaceUuid
        };
      }));

    });
  }

  @ApiCaller()
  async getDefaultWorkspaceUuid(): Promise<string> {
    logger.trace(`[Module Workspace] -> getDefaultWorkspaceUuid`);

    const workspaces: Workspace[] = await this.getWorkspacesDetails();
    return workspaces.find((workspace: Workspace) => workspace.ownerUuid === this.userUuid && workspace.default === true)!.workspaceUuid;
  }

  @ApiCaller()
  async getWorkspaceByUuid(workspaceUuid: string): Promise<Workspace> {
    logger.trace(`[Module Workspace] -> getWorkspaceByUuid [${workspaceUuid}]`);

    return this.vaultClient.read(`secret/workspaces/${workspaceUuid}`).then(request => request.data);
  }

}
