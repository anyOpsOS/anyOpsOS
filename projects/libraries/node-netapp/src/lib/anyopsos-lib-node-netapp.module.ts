import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';

import { AnyOpsOSLibBootstrapService } from '@anyopsos/lib-bootstrap';

import { AnyOpsOSLibNodeNetappConnectionsStateService } from './services/anyopsos-lib-node-netapp-connections-state.service';
import { AnyOpsOSLibNodeNetappFileSystemHandlersService } from './services/anyopsos-lib-node-netapp-file-system-handlers.service';
import { AnyOpsOSLibNodeNetappFileSystemService } from './services/anyopsos-lib-node-netapp-file-system.service';
import { AnyOpsOSLibNodeNetappHelpersService } from './services/anyopsos-lib-node-netapp-helpers.service';
import { AnyOpsOSLibNodeNetappSoapApiHelpersService } from './services/anyopsos-lib-node-netapp-soap-api-helpers.service';
import { AnyOpsOSLibNodeNetappSoapApiService } from './services/anyopsos-lib-node-netapp-soap-api.service';
import { AnyOpsOSLibNodeNetappService } from './services/anyopsos-lib-node-netapp.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class AnyOpsOSLibNodeNetappModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibNodeNetappModule,
              private readonly LibBootstrap: AnyOpsOSLibBootstrapService,
              private readonly LibNodeNetappConnectionsState: AnyOpsOSLibNodeNetappConnectionsStateService,
              private readonly LibNodeNetappFileSystemHandlers: AnyOpsOSLibNodeNetappFileSystemHandlersService) {
    console.log('Loading AnyOpsOSLibNodeNetappModule');

    if (parentModule) {
      // throw new Error(
      // 'AnyOpsOSLibNodeNetappModule is already loaded. You should not import it manually.');
    }

    // Initialize connections when user is loggedIn
    this.LibBootstrap.currentBootstrapState.subscribe((data: { appBootstrapped: boolean; }) => {
      if (data.appBootstrapped === true && !this.LibNodeNetappConnectionsState.getConnectionsInitialized()) {

        // Get Netapp connections
        this.LibNodeNetappConnectionsState.initConnections();

        // This allows to manage file and folders
        this.LibNodeNetappFileSystemHandlers.registerFileSystemUiHandlers();
      }
    });

  }

  static forRoot(): ModuleWithProviders<AnyOpsOSLibNodeNetappModule> {
    return {
      ngModule: AnyOpsOSLibNodeNetappModule,
      providers: [
        AnyOpsOSLibNodeNetappConnectionsStateService,
        AnyOpsOSLibNodeNetappFileSystemHandlersService,
        AnyOpsOSLibNodeNetappFileSystemService,
        AnyOpsOSLibNodeNetappHelpersService,
        AnyOpsOSLibNodeNetappSoapApiHelpersService,
        AnyOpsOSLibNodeNetappSoapApiService,
        AnyOpsOSLibNodeNetappService
      ]
    };
  }

}
