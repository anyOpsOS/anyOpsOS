import log4js, {Logger} from 'log4js';
import {client} from 'node-vault';

// TODO ESM
const {configure, getLogger} = log4js

import {AnyOpsOSVaultModule, VaultState} from '@anyopsos/module-vault'
import {AnyOpsOSAuthModule, User} from '@anyopsos/module-auth'
import {AnyOpsOSFileSystemModule} from '@anyopsos/module-file-system';
import {AnyOpsOSConfigFileModule} from '@anyopsos/module-config-file';


const logger: Logger = getLogger('mainLog');

export class Init {

  private VaultModule: AnyOpsOSVaultModule = new AnyOpsOSVaultModule();
  private AuthModule: AnyOpsOSAuthModule = new AnyOpsOSAuthModule();

  // @ts-ignore TODO
  private FileSystemModule: AnyOpsOSFileSystemModule = new AnyOpsOSFileSystemModule();
  private ConfigFileModule: AnyOpsOSConfigFileModule = new AnyOpsOSConfigFileModule();

  constructor() {
    configure({
      appenders: {
        console: {type: 'console', level: 'trace'}
      },
      categories: {
        default: {appenders: ['console'], level: 'trace'},
        mainLog: {appenders: ['console'], level: 'trace'},
        auth: {appenders: ['console'], level: 'trace'},
        credential: {appenders: ['console'], level: 'trace'},
        vault: {appenders: ['console'], level: 'trace'}
      }
    });
  }

  /**
   * Checks if every user have its own Folders and configurations created
   */
  private async checkUsers(state: VaultState): Promise<void> {
    logger.info(`[Auth] -> initialize -> checkUsers`);

    await this.FileSystemModule.putFolder(`/home/nada/Desktop`);

    if (state.users === 0) return;

    const users: string[] = await this.VaultModule.getUsersList();
    console.log(users);
    users.forEach(async (username: string) => {
      const user: User = await this.AuthModule.geUserDetail(username);

      // Check for user Home folder
      this.FileSystemModule.getFolder(user.home).catch(async (e: Error) => {

        console.log(e);

        // Home folder for that user doesn't exists
        if (e.message === 'resource_not_found') {
          await this.FileSystemModule.putFolder(`${user.home}/Desktop`);
          await this.FileSystemModule.putFolder(`${user.home}/Documents`);
          await this.FileSystemModule.putFolder(`${user.home}/Desktop`);
          await this.FileSystemModule.putFolder(`${user.home}/Downloads`);
          await this.FileSystemModule.putFolder(`${user.home}/Workspaces/default/etc`);
          await this.ConfigFileModule.put(`${user.home}/Workspaces/default/etc/task_bar.json`, []);
        }

      // TODO: Check for each user Workspace folders are created
      }).then(() => {
      });
    })
    
  }

  /**
   * Logins the Pod to the Vault. This step is required in order to acces the Vault by the Auth Pod.
   */
  private async loginVault(): Promise<VaultState> {
    logger.info(`[Auth] -> initialize -> loginVault`);

    const vaultClient: client = this.VaultModule.getVaultClient();

    // Try to get state of the Vault server
    const vaultStatus: VaultState = await this.VaultModule.getVaultState();

    if (!vaultStatus.sealed && !vaultClient.token) {
      logger.info(`[Auth] -> Login Pod into Vault`);
      await this.VaultModule.loginVault();
    }

    return vaultStatus;
  }

  /**
   * Main function that launch all system checks
   */
  public async initialize(): Promise<void> {
    logger.trace(`[Auth] -> initialize`);

    return Promise.all([
      this.loginVault()
    ]).then(([state]) => this.checkUsers(state)).catch((e) => {
      console.log(e);
    });

  }
}
