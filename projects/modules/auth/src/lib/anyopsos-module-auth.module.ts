import log4js, {Logger} from 'log4js';
import {v4 as uuidv4} from 'uuid';
import {client} from 'node-vault';

// TODO ESM
const {getLogger} = log4js;

import {AnyOpsOSVaultModule} from '@anyopsos/module-vault';
import {AnyOpsOSFileSystemModule} from '@anyopsos/module-file-system';
import {AnyOpsOSSysWorkspaceModule} from '@anyopsos/module-sys-workspace';

import {User} from './types/user';


const logger: Logger = getLogger('auth');

/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * When modifying this module, make sure you check that userUuid & sessionUuid from the Class Constructor provided data
 * Those are not mandatory since the function {@link authenticateUser} doesn't use it
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 * This module will only work inside 'anyopsos-auth' Pod since it uses the Kubernetes Pod Service Account to login with Vault
 */
export class AnyOpsOSAuthModule {

  private readonly VaultModule: AnyOpsOSVaultModule = new AnyOpsOSVaultModule();
  private readonly vaultClient: client = this.VaultModule.getVaultClient();

  private validPrivilegedUser: boolean = false;

  // With no parameters, means no authentication.
  constructor(private readonly userUuid?: string) {

    // TODO: VALIDATE PRIVILEGES
    if (this.userUuid) this.validPrivilegedUser = true;
  }

  /**
   * Returns a user and its data
   */
  async geUserDetail(username: string): Promise<User> {
    logger.trace(`[Module Vault] -> geUserDetail`);

    const user: { data: User } = await this.vaultClient.read(`secret/users/${username}`);

    return user.data;
  }

  /**
   * Main function to authenticate a user
   * TODO params needs to be extra sanitized (length, characters, convert to string, ...)
   */
  async authenticateUser(username: string, password: string): Promise<{ successLogin: boolean; userUuid: string; }> {
    logger.debug(`[Module Auth] -> authenticateUser -> username [${username}]`);

    // Check if user not exists
    const users: string[] = await this.VaultModule.getUsersList();

    console.log(users);

    if (!users.includes(username)) {
      logger.warn(`[Module Vault] -> authenticateUser -> Invalid Username -> username [${username}]`);
      throw new Error('resource_not_found');
    }

    this.vaultClient.generateFunction('authenticateUser', {
      method: 'POST',
      path: '/auth/userpass/login/{{username}}',
      schema: {
        req: {
          type: 'object',
          properties: {
            password: {
              type: 'string',
            },
          },
          required: ['password'],
        },
        res: {}
      },
    })

    // Check login against Vault
    await (this.vaultClient as client & { authenticateUser: (...args: [{username: string; password: string}]) => Promise<void> })
      .authenticateUser({ username, password });

    const user: User = await this.geUserDetail(username);

    console.log(user);

    return {
      successLogin: true,
      userUuid: user.uuid
    }
  }

  /**
   * From here, we must make sure that we are allowed to access/modify the user/s information by using the Class Constructor provided data {@link validPrivilegedUser}
   * --------
   */

  /**
   * We have to make sure that the user requesting a new user have the required privileges to perform this action
   */
  async createUser(username: string): Promise<{ successCreated: boolean; userUuid: string; password: string; }> {
    logger.debug(`[Module Auth] -> createUser -> username [${username}]`);

    const users: string[] = await this.VaultModule.getUsersList();

    // Allow to create the first user (when initializing the vault)
    if (users.length !== 0 && !this.validPrivilegedUser) {
      logger.warn(`[Module Auth] -> createUser -> Insufficient permissions to create a User [${username}] -> userUuid [${this.userUuid}]`);
      throw new Error('action_not_allowed');
    }
    // TODO: get user role and if is allowed to create users

    // Check if user already exists
    if (users.includes(username)) throw new Error('resource_already_exists');

    // Generate new random password & uuid
    const password: string = Math.random().toString(32);
    const userUuid: string = uuidv4();

    const userData = { uuid: userUuid, home: `/home/${username}` };

    // Insert user into Vault
    await this.vaultClient.write(`auth/userpass/users/${username}`, { password });
    await this.vaultClient.write(`secret/users/${username}`, { uuid: userUuid, home: `/home/${username}` });

    await this.createUserWorkspace({...userData, username} as User);

    logger.info(`[Module Auth] -> createUser -> New User created [${username}] -> userUuid [${userUuid}]`);

    return {
      successCreated: true,
      userUuid,
      password
    }
  }

  /**
   * Creates the basic filesystem structure for a user.
   */
  async createUserWorkspace(user: User): Promise<void> {

    // TODO, extract sessionId to pass security, and get realWorkspaceUuid
    const FileSystemModule: AnyOpsOSFileSystemModule = new AnyOpsOSFileSystemModule(user.uuid);
    const WorkspaceModule: AnyOpsOSSysWorkspaceModule = new AnyOpsOSSysWorkspaceModule(user.uuid);

    // Continue if resources already exists
    await FileSystemModule.putFolder(`${user.home}/Desktop`).catch((e: any) => {
      if (e === 'resource_already_exists') return;
      throw e;
    });
    await FileSystemModule.putFolder(`${user.home}/Documents`).catch((e: any) => {
      if (e === 'resource_already_exists') return;
      throw e;
    });
    await FileSystemModule.putFolder(`${user.home}/Downloads`).catch((e: any) => {
      if (e === 'resource_already_exists') return;
      throw e;
    });
    await FileSystemModule.putFolder(`${user.home}/Workspaces`).catch((e: any) => {
      if (e === 'resource_already_exists') return;
      throw e;
    });
    await WorkspaceModule.createWorkspace('default', `${user.home}/Workspaces/default/`, true).catch((e: any) => {
      if (e === 'resource_already_exists') return;
      throw e;
    });
  }

}
