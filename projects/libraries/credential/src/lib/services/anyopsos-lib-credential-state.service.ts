import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {AnyOpsOSLibLoggerService} from '@anyopsos/lib-logger';
import {Credential} from '@anyopsos/module-credential';
import {BackendResponse} from '@anyopsos/backend-core/app/types/backend-response';

import {AnyOpsOSLibCredentialApiService} from './anyopsos-lib-credential-api.service';

@Injectable({
  providedIn: 'root'
})
export class AnyOpsOSLibCredentialStateService {
  private credentialsInitialized: boolean = false;

  readonly $credentials: BehaviorSubject<Omit<Credential, 'password'>[] |[]>;
  private dataStore: {
    credentials: Omit<Credential, 'password'>[],
  };
  readonly credentials: Observable<Omit<Credential, 'password'>[]>;

  constructor(private readonly logger: AnyOpsOSLibLoggerService,
              private readonly LibCredentialApi: AnyOpsOSLibCredentialApiService) {

    this.dataStore = { credentials: [] };
    this.$credentials = new BehaviorSubject(this.dataStore.credentials);
    this.credentials = this.$credentials.asObservable();
  }

  /**
   * Setter & Getter of credentialsInitialized
   * This variable ensures Credentials are loaded only once
   */
  setCredentialsInitialized(): void {
    if (this.credentialsInitialized === true) {

      this.logger.error('LibCredential', 'setCredentialsInitialized -> Credentials already initialized');
      throw new Error('already_initialized');
    }

    this.credentialsInitialized = true;
  }

  getCredentialsInitialized(): boolean {
    return this.credentialsInitialized;
  }

  /**
   * Updates the current state with a new credential
   */
  async putCredential(credential: Omit<Credential, 'password'>): Promise<void>;
  async putCredential(credential: Omit<Credential, 'uuid'>): Promise<void>
  async putCredential(credential: Credential): Promise<void> {
    this.logger.debug('LibCredential', 'New credential received');

    // New credential. Backend will return the credential with a uuid
    if (!credential.uuid) {
      credential.uuid = await this.saveBackend(credential, 'put');

      // Remove password after its stored at backend
      delete credential.password;

      this.dataStore.credentials.push(credential);

    // If already have an uuid, means that this is called on {@link AnyOpsOSLibCredentialService#initCredentials}
    } else {
      this.dataStore.credentials.push(credential);
    }

    this.$credentials.next(Object.assign({}, this.dataStore).credentials);
  }

  /**
   * Updates a credential state
   */
  async patchCredential(credentialUuid: string, toUpdate: Partial<Credential>): Promise<void> {
    const credentialIndex: number = this.dataStore.credentials.findIndex((cred: Omit<Credential, 'password'>) => cred.uuid === credentialUuid);
    if (credentialIndex === -1) {
      this.logger.error('LibCredential', 'patchCredential -> Resource invalid');
      throw new Error('resource_invalid');
    }

    await this.saveBackend(toUpdate, 'patch', credentialUuid);

    // Update Credential and delete the password
    const newCredentialData: Credential = { ...this.dataStore.credentials[credentialIndex], ...toUpdate };
    delete newCredentialData.password;

    this.dataStore.credentials[credentialIndex] = newCredentialData;

    // broadcast data to subscribers
    this.$credentials.next(Object.assign({}, this.dataStore).credentials);
  }

  /**
   * Deletes a credential from state
   */
  async deleteCredential(credentialUuid: string): Promise<void> {
    const currentCredential: Omit<Credential, 'password'> = this.dataStore.credentials.find(credential => credential.uuid === credentialUuid);
    if (!currentCredential) {
      this.logger.error('LibCredential', 'deleteCredential -> Resource invalid');
      throw new Error('resource_invalid');
    }

    await this.saveBackend(currentCredential, 'delete');

    this.dataStore.credentials = this.dataStore.credentials.filter((credential: Omit<Credential, 'password'>) => credential.uuid !== credentialUuid);

    // broadcast data to subscribers
    this.$credentials.next(Object.assign({}, this.dataStore).credentials);
  }

  /**
   * Saves current state persistently
   */
  private saveBackend(currentCredential: Omit<Credential, 'uuid'>, type: 'put'): Promise<string>;
  private saveBackend(currentCredential: Omit<Credential, 'password'>, type: 'delete'): Promise<string>;
  private saveBackend(currentCredential: Partial<Credential>, type: 'patch', credentialUuid: string): Promise<string>;
  private saveBackend(currentCredential: Credential, type: 'put' | 'patch' | 'delete', credentialUuid?: string): Promise<string> {
    return new Promise(async (resolve, reject) => {

      let credentialObservable: Observable<Object>;

      if (type === 'put') credentialObservable = this.LibCredentialApi.putCredential(currentCredential);
      if (type === 'patch') credentialObservable = this.LibCredentialApi.patchCredential(credentialUuid, currentCredential);
      if (type === 'delete') credentialObservable = this.LibCredentialApi.deleteCredential(currentCredential.uuid);

      credentialObservable.subscribe((credentialStatus: BackendResponse & { data: string }) => {
          if (credentialStatus.status === 'error') {
            this.logger.error('LibCredential', 'Error while saving credential', null, credentialStatus.data);
            return reject(credentialStatus.data);
          }

          this.logger.debug('LibCredential', 'Saved credential successfully');
          return resolve(credentialStatus.data.uuid);
        },
        error => {
          this.logger.error('LibCredential', 'Error while saving credential', null, error);
          return reject(error);
        });

    });
  }
}
