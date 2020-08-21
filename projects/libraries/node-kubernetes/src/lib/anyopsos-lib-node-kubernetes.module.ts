import {NgModule} from '@angular/core';

import {AnyopsosLibBootstrapService} from '@anyopsos/lib-bootstrap';

import {AnyOpsOSLibNodeKubernetesConnectionsStateService} from './services/anyopsos-lib-node-kubernetes-connections-state.service';
import {AnyOpsOSLibNodeKubernetesFileSystemHandlersService} from './services/anyopsos-lib-node-kubernetes-file-system-handlers.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class AnyOpsOSLibNodeKubernetesModule {

  constructor(private readonly LibBootstrap: AnyopsosLibBootstrapService,
              private readonly LibNodeKubernetesConnectionsState: AnyOpsOSLibNodeKubernetesConnectionsStateService,
              private readonly LibNodeKubernetesFileSystemHandlers: AnyOpsOSLibNodeKubernetesFileSystemHandlersService) {

    // Initialize connections when user is loggedIn
    this.LibBootstrap.currentBootstrapState.subscribe((data: { appBootstrapped: boolean; }) => {
      if (data.appBootstrapped === true && !this.LibNodeKubernetesConnectionsState.getConnectionsInitialized()) {

        // Get Kubernetes connections
        this.LibNodeKubernetesConnectionsState.initConnections();

        // This allows to manage file and folders
        this.LibNodeKubernetesFileSystemHandlers.registerFileSystemUiHandlers();
      }
    });

  }
}
