import {Injectable} from '@angular/core';

import {Credential} from '@anyopsos/module-credential';
import {AnyOpsOSLibLoggerService} from '@anyopsos/lib-logger';

import {AnyOpsOSLibCredentialStateService} from './anyopsos-lib-credential-state.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnyOpsOSLibCredentialHelpersService {

  constructor(private readonly logger: AnyOpsOSLibLoggerService,
              private readonly LibCredentialState: AnyOpsOSLibCredentialStateService) {
  }

  /**
   * Gets a credential state by given credentialUuid
   */
  getCredentialByUuid(credentialUuid: string): Omit<Credential, 'password'> {
    const credentials: Omit<Credential, 'password'>[] = this.getAllCredentials();

    const currentCredential: Omit<Credential, 'password'> = credentials.find((credential: Omit<Credential, 'password'>) => {
      return credential.uuid === credentialUuid;
    });

    if (!currentCredential) {
      this.logger.error('LibCredential', 'getCredentialByUuid -> Resource invalid');
      throw new Error('resource_invalid');
    }
    return currentCredential;
  }

  /**
   * Returns all connections
   */
  getAllCredentials(): Omit<Credential, 'password'>[] {
    return this.LibCredentialState.$credentials.getValue();
  }

  /**
   * Returns all connections as Observable
   */
  getAllCredentialsObserver(): Observable<Omit<Credential, 'password'>[]> {
    return this.LibCredentialState.credentials;
  }
}
