import { client } from 'node-vault';
import { v4 as uuidv4 } from 'uuid';
import log4js, { Logger } from 'log4js';

// TODO ESM
const { getLogger } = log4js;

import { AnyOpsOSSysWorkspaceModule } from '@anyopsos/module-sys-workspace';
import { AnyOpsOSVaultModule } from '@anyopsos/module-vault';

import { ApiCaller } from './decorators/api-caller'

import { Credential } from './types/credential';


const logger: Logger = getLogger('credential');

/**
 * This module will only work inside 'anyopsos-auth' Pod since it uses the Kubernetes Pod Service Account to login with Vault
 */
export class AnyOpsOSCredentialModule {

  private readonly WorkspaceModule: AnyOpsOSSysWorkspaceModule;
  private readonly VaultModule: AnyOpsOSVaultModule = new AnyOpsOSVaultModule();
  private readonly vaultClient: client = this.VaultModule.getVaultClient();

  constructor(private readonly userUuid: string,
              private readonly workspaceUuid: string) {

    // TODO: check if userUuid is allowed to access the data from workspaceUuid
    // TODO FIXME: VALIDATE PRIVILEGES
    this.WorkspaceModule = new AnyOpsOSSysWorkspaceModule(this.userUuid);

    // this.WorkspaceModule.getUserPermissions();
  }


  /**
   * From here, we must make sure that we are allowed to access/modify the credential/s information by using the Class Constructor provided data
   * Credentials are split by Workspaces, which means that we have to validate this.userId with this.sessionUuid and then if this.userId belongs to this.workspaceUuid
   * --------
   */

  /**
   * Gets all credentials but without passwords.
   * This is the main function called by the credentials library (lib-credentials) to show to the users the credentials available for the current workspace
   * Frontend call this using the API
   */
  // TODO type any required bevause of the catch
  @ApiCaller()
  async getCredentials(): Promise<Omit<Credential, 'password'>[] | any> {
    logger.trace(`[Module Credentials] -> getCredentials -> userUuid [${this.userUuid}], workspaceUuid [${this.workspaceUuid}]`);

    return this.vaultClient.list(`secret/workspaces/${this.workspaceUuid}/`).then(request => {

      return Promise.all(request.data.keys.map(async (credential: string) => {

        // Do no send the password back
        const credentialData: Credential = await this.getCredential(credential);
        delete credentialData.password;

        return {
          ...credentialData,
          uuid: credential
        } as Omit<Credential, 'password'>;
      }));

    }).catch(e => {
      if (e.response?.statusCode === 404) return [];
      throw e;
    });
  }

  /**
   * Returns a credential with the password
   * This data should never be returned to the user. anyOpsOS doesn't allow to send passwords back to the user
   * This is used by other modules to connect with "something"
   * TODO: since this function is exposed by an API, make sure this can't be called by an user from the browser. Validate 'anyopsos-core' Pod certificate
   */
  @ApiCaller()
  async getCredential(credentialUuid: string): Promise<Credential> {
    logger.trace(`[Module Credentials] -> getCredential -> userUuid [${this.userUuid}], workspaceUuid [${this.workspaceUuid}], credentialUuid [${credentialUuid}]`);

    return this.vaultClient.read(`secret/workspaces/${this.workspaceUuid}/${credentialUuid}`).then(request => request.data);
  }

  /**
   * Creates a new credential. Some modules can call this as well (infrastructure as code applications...)
   * Users call this using the API
   * TODO: check if user is allowed to write data to this workspace (not read-only)
   * TODO: check if already exists (patch)
   */
  @ApiCaller()
  async putCredential(credential: Omit<Credential, 'uuid'>): Promise<string> {
    logger.trace(`[Module Credentials] -> putCredential -> userUuid [${this.userUuid}], workspaceUuid [${this.workspaceUuid}]`);

    const credentialUuid: string = uuidv4();

    await this.vaultClient.write(`secret/workspaces/${this.workspaceUuid}/${credentialUuid}`, credential);

    return credentialUuid;
  }

  /**
   * Modifies a credential. Some modules can call this as well (rotate passwords...)
   * Users call this using the API
   * TODO: check if user is allowed to modify data from this workspace (not read-only)
   * TODO: check if not exists (put)
   */
  @ApiCaller()
  async patchCredential(credentialUuid: string, credential: Partial<Credential>): Promise<string> {
    logger.trace(`[Module Credentials] -> patchCredential -> userUuid [${this.userUuid}], workspaceUuid [${this.workspaceUuid}], credentialUuid [${credentialUuid}]`);

    const currentCredential: Credential = await this.getCredential(credentialUuid);
    const newCredential: Credential = { ...currentCredential, ...credential };
    delete newCredential.uuid;

    await this.vaultClient.write(`secret/workspaces/${this.workspaceUuid}/${credentialUuid}`, newCredential);

    return credentialUuid;
  }

  /**
   * Deletes a credential.
   * Users call this using the API
   * TODO: check if user is allowed to delete data from this workspace (not read-only)
   * TODO: check if not exists
   */
  @ApiCaller()
  async deleteCredential(credentialUuid: string): Promise<void> {
    logger.trace(`[Module Credentials] -> deleteCredential -> userUuid [${this.userUuid}], workspaceUuid [${this.workspaceUuid}], credentialUuid [${credentialUuid}]`);

    await this.vaultClient.delete(`secret/workspaces/${this.workspaceUuid}/${credentialUuid}`);

    return;
  }

}
