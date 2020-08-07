import {join} from 'path';
import {client} from 'node-vault';
import log4js, {Logger} from 'log4js';
import {v4 as uuidv4} from 'uuid';

// TODO ESM
const {getLogger} = log4js;

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

    return this.vaultClient.list(`secret/workspaces/`).then(request => request.data.keys);
  }

  async createWorkspace(name: string, path: string, isDefault: boolean = false): Promise<void> {
    logger.trace(`[Module Workspace] -> createWorkspace name [${name}], path [${path}], isDefault [${isDefault}]`);

    const workspaceUuid: string = uuidv4();

    const FileSystemModule: AnyOpsOSFileSystemModule = new AnyOpsOSFileSystemModule(this.userUuid);
    const ConfigFileModule: AnyOpsOSConfigFileModule = new AnyOpsOSConfigFileModule(this.userUuid, workspaceUuid);

    await this.vaultClient.write(`secret/workspaces/${workspaceUuid}`, { name, ownerUuid: this.userUuid, path, default: isDefault } as Workspace);
    await FileSystemModule.putFolder(join(path, 'etc'));
    await ConfigFileModule.put(`task_bar.json`, []);
  }

  @ApiCaller()
  async getWorkspacesDetails(): Promise<Workspace[]> {
    logger.trace(`[Module Workspace] -> getWorkspacesDetails`);

    return this.getWorkspaces().then(async (workspaces: string[]) => {

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
  async getDefaultWorkspace(): Promise<Workspace> {
    logger.trace(`[Module Workspace] -> getDefaultWorkspace`);

    const workspaces: Workspace[] = await this.getWorkspacesDetails();

    return workspaces.find((workspace: Workspace) => workspace.ownerUuid === this.userUuid && workspace.default === true)!;
  }

  @ApiCaller()
  async getWorkspaceByUuid(workspaceUuid: string): Promise<Workspace> {
    logger.trace(`[Module Workspace] -> getWorkspaceByUuid [${workspaceUuid}]`);

    return this.vaultClient.read(`secret/workspaces/${workspaceUuid}`).then(request => request.data);
  }

}
