import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';

import { AnyOpsOSLibBootstrapService } from '@anyopsos/lib-bootstrap';

import { AnyOpsOSLibNodeDockerService } from './services/anyopsos-lib-node-docker.service';
import { AnyOpsOSLibNodeDockerApiService } from './services/anyopsos-lib-node-docker-api.service';
import { AnyOpsOSLibNodeDockerHelpersService } from './services/anyopsos-lib-node-docker-helpers.service';
import { AnyOpsOSLibNodeDockerConnectionsStateService } from './services/anyopsos-lib-node-docker-connections-state.service';
import { AnyOpsOSLibNodeDockerFileSystemHandlersService } from './services/anyopsos-lib-node-docker-file-system-handlers.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class AnyOpsOSLibNodeDockerModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibNodeDockerModule,
              private readonly LibBootstrap: AnyOpsOSLibBootstrapService,
              private readonly LibNodeDockerConnectionsState: AnyOpsOSLibNodeDockerConnectionsStateService,
              private readonly LibNodeDockerFileSystemHandlers: AnyOpsOSLibNodeDockerFileSystemHandlersService) {
    console.log('Loading AnyOpsOSLibNodeDockerModule');

    if (parentModule) {
      // throw new Error(
      // 'AnyOpsOSLibNodeDockerModule is already loaded. You should not import it manually.');
    }

    // Initialize connections when user is loggedIn
    this.LibBootstrap.currentBootstrapState.subscribe((data: { appBootstrapped: boolean; }) => {
      if (data.appBootstrapped === true && !this.LibNodeDockerConnectionsState.getConnectionsInitialized()) {

        // Get Docker connections
        this.LibNodeDockerConnectionsState.initConnections();

        // This allows to manage file and folders
        this.LibNodeDockerFileSystemHandlers.registerFileSystemUiHandlers();
      }
    });

  }

  static forRoot(): ModuleWithProviders<AnyOpsOSLibNodeDockerModule> {
    return {
      ngModule: AnyOpsOSLibNodeDockerModule,
      providers: [
        AnyOpsOSLibNodeDockerService,
        AnyOpsOSLibNodeDockerApiService,
        AnyOpsOSLibNodeDockerHelpersService,
        AnyOpsOSLibNodeDockerConnectionsStateService,
        AnyOpsOSLibNodeDockerFileSystemHandlersService
      ]
    };
  }

}
