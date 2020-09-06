import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';

import { AnyOpsOSLibBootstrapService } from '@anyopsos/lib-bootstrap';

import { AnyOpsOSLibCredentialService } from './services/anyopsos-lib-credential.service';
import { AnyOpsOSLibCredentialStateService } from './services/anyopsos-lib-credential-state.service';
import { AnyOpsOSLibCredentialApiService } from './services/anyopsos-lib-credential-api.service';
import { AnyOpsOSLibCredentialHelpersService } from './services/anyopsos-lib-credential-helpers.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class AnyOpsOSLibCredentialModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibCredentialModule,
              private readonly LibBootstrap: AnyOpsOSLibBootstrapService,
              private readonly LibCredential: AnyOpsOSLibCredentialService,
              private readonly LibCredentialState: AnyOpsOSLibCredentialStateService) {
    console.log('Loading AnyOpsOSLibCredentialModule');

    if (parentModule) {
      throw new Error(
        'AnyOpsOSLibCredentialModule is already loaded. You should not import it manually.');
    }

    // Initialize credentials when user is loggedIn
    this.LibBootstrap.currentBootstrapState.subscribe((data: { appBootstrapped: boolean; }) => {
      if (data.appBootstrapped === true && !this.LibCredentialState.getCredentialsInitialized()) {

        // Get Credentials
        this.LibCredential.initCredentials();
      }
    });

  }

  static forRoot(): ModuleWithProviders<AnyOpsOSLibCredentialModule> {
    return {
      ngModule: AnyOpsOSLibCredentialModule,
      providers: [
        AnyOpsOSLibCredentialService,
        AnyOpsOSLibCredentialStateService,
        AnyOpsOSLibCredentialApiService,
        AnyOpsOSLibCredentialHelpersService
      ]
    };
  }

}
