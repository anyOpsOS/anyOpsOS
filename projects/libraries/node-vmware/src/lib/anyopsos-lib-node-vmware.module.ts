import {NgModule} from '@angular/core';

import {AnyopsosLibBootstrapService} from '@anyopsos/lib-bootstrap';

import {AnyOpsOSLibNodeVmwareConnectionsStateService} from './services/anyopsos-lib-node-vmware-connections-state.service';
import {AnyOpsOSLibNodeVmwareFileSystemHandlersService} from './services/anyopsos-lib-node-vmware-file-system-handlers.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class AnyOpsOSLibNodeVmwareModule {

  constructor(private readonly LibBootstrap: AnyopsosLibBootstrapService,
              private readonly LibNodeVmwareConnectionsState: AnyOpsOSLibNodeVmwareConnectionsStateService,
              private readonly LibNodeVmwareFileSystemHandlers: AnyOpsOSLibNodeVmwareFileSystemHandlersService) {

    // Initialize connections when user is loggedIn
    this.LibBootstrap.currentBootstrapState.subscribe((data: { appBootstrapped: boolean; }) => {
      if (data.appBootstrapped === true && !this.LibNodeVmwareConnectionsState.getConnectionsInitialized()) {

        // Get Vmware connections
        this.LibNodeVmwareConnectionsState.initConnections();

        // This allows to manage file and folders
        this.LibNodeVmwareFileSystemHandlers.registerFileSystemUiHandlers();
      }
    });

  }
}
