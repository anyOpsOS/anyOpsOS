import {NgModule} from '@angular/core';

import {AnyopsosLibBootstrapService} from '@anyopsos/lib-bootstrap';

import {AnyOpsOSLibCredentialService} from './services/anyopsos-lib-credential.service';
import {AnyOpsOSLibCredentialStateService} from './services/anyopsos-lib-credential-state.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class AnyOpsOSLibCredentialModule {

  constructor(private readonly LibBootstrap: AnyopsosLibBootstrapService,
              private readonly LibCredential: AnyOpsOSLibCredentialService,
              private readonly LibCredentialState: AnyOpsOSLibCredentialStateService) {

    // Initialize credentials when user is loggedIn
    this.LibBootstrap.currentBootstrapState.subscribe((data: { appBootstrapped: boolean; }) => {
      if (data.appBootstrapped === true && !this.LibCredentialState.getCredentialsInitialized()) {

        // Get Credentials
        this.LibCredential.initCredentials();
      }
    });

  }

}
