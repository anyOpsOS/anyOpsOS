import {NgModule, ModuleWithProviders, Optional, SkipSelf} from '@angular/core';

import {AnyOpsOSLibBootstrapService} from '@anyopsos/lib-bootstrap';

import {AnyOpsOSLibNodeKubernetesService} from './services/anyopsos-lib-node-kubernetes.service';
import {AnyOpsOSLibNodeKubernetesApiService} from './services/anyopsos-lib-node-kubernetes-api.service';
import {AnyOpsOSLibNodeKubernetesHelpersService} from './services/anyopsos-lib-node-kubernetes-helpers.service';
import {AnyOpsOSLibNodeKubernetesObjectHelpersService} from './services/anyopsos-lib-node-kubernetes-object-helpers.service';
import {AnyOpsOSLibNodeKubernetesConnectionsStateService} from './services/anyopsos-lib-node-kubernetes-connections-state.service';
import {AnyOpsOSLibNodeKubernetesFileSystemHandlersService} from './services/anyopsos-lib-node-kubernetes-file-system-handlers.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class AnyOpsOSLibNodeKubernetesModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibNodeKubernetesModule,
              private readonly LibBootstrap: AnyOpsOSLibBootstrapService,
              private readonly LibNodeKubernetesConnectionsState: AnyOpsOSLibNodeKubernetesConnectionsStateService,
              private readonly LibNodeKubernetesFileSystemHandlers: AnyOpsOSLibNodeKubernetesFileSystemHandlersService) {
    console.log('Loading AnyOpsOSLibNodeKubernetesModule');

    if (parentModule) {
      //throw new Error(
        //'AnyOpsOSLibNodeKubernetesModule is already loaded. You should not import it manually.');
    }

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

  static forRoot(): ModuleWithProviders<AnyOpsOSLibNodeKubernetesModule> {
    return {
      ngModule: AnyOpsOSLibNodeKubernetesModule,
      providers: [
        AnyOpsOSLibNodeKubernetesService,
        AnyOpsOSLibNodeKubernetesApiService,
        AnyOpsOSLibNodeKubernetesHelpersService,
        AnyOpsOSLibNodeKubernetesObjectHelpersService,
        AnyOpsOSLibNodeKubernetesConnectionsStateService,
        AnyOpsOSLibNodeKubernetesFileSystemHandlersService
      ]
    };
  }

}
