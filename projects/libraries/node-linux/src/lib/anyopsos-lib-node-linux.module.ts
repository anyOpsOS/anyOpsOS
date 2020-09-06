import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';

import { AnyOpsOSLibBootstrapService } from '@anyopsos/lib-bootstrap';

import { AnyOpsOSLibNodeLinuxService } from './services/anyopsos-lib-node-linux.service';
import { AnyOpsOSLibNodeLinuxApiService } from './services/anyopsos-lib-node-linux-api.service';
import { AnyOpsOSLibNodeLinuxHelpersService } from './services/anyopsos-lib-node-linux-helpers.service';
import { AnyOpsOSLibNodeLinuxConnectionsStateService } from './services/anyopsos-lib-node-linux-connections-state.service';
import { AnyOpsOSLibNodeLinuxFileSystemHandlersService } from './services/anyopsos-lib-node-linux-file-system-handlers.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class AnyOpsOSLibNodeLinuxModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibNodeLinuxModule,
              private readonly LibBootstrap: AnyOpsOSLibBootstrapService,
              private readonly LibNodeLinuxConnectionsState: AnyOpsOSLibNodeLinuxConnectionsStateService,
              private readonly LibNodeLinuxFileSystemHandlers: AnyOpsOSLibNodeLinuxFileSystemHandlersService) {
    console.log('Loading AnyOpsOSLibNodeLinuxModule');

    if (parentModule) {
      // throw new Error(
      // 'AnyOpsOSLibNodeLinuxModule is already loaded. You should not import it manually.');
    }

    // Initialize connections when user is loggedIn
    this.LibBootstrap.currentBootstrapState.subscribe((data: { appBootstrapped: boolean; }) => {
      if (data.appBootstrapped === true && !this.LibNodeLinuxConnectionsState.getConnectionsInitialized()) {

        // Get Linux connections
        this.LibNodeLinuxConnectionsState.initConnections();

        // This allows to manage file and folders
        this.LibNodeLinuxFileSystemHandlers.registerFileSystemUiHandlers();
      }
    });

  }

  static forRoot(): ModuleWithProviders<AnyOpsOSLibNodeLinuxModule> {
    return {
      ngModule: AnyOpsOSLibNodeLinuxModule,
      providers: [
        AnyOpsOSLibNodeLinuxService,
        AnyOpsOSLibNodeLinuxApiService,
        AnyOpsOSLibNodeLinuxHelpersService,
        AnyOpsOSLibNodeLinuxConnectionsStateService,
        AnyOpsOSLibNodeLinuxFileSystemHandlersService
      ]
    };
  }

}
