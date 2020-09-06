import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';

import { AnyOpsOSLibBootstrapService } from '@anyopsos/lib-bootstrap';

import { AnyOpsOSLibNodeVmwareConnectionsStateService } from './services/anyopsos-lib-node-vmware-connections-state.service';
import { AnyOpsOSLibNodeVmwareFileSystemHandlersService } from './services/anyopsos-lib-node-vmware-file-system-handlers.service';
import { AnyOpsOSLibNodeVmwareFileSystemService } from './services/anyopsos-lib-node-vmware-file-system.service';
import { AnyOpsOSLibNodeVmwareHelpersService } from './services/anyopsos-lib-node-vmware-helpers.service';
import { AnyOpsOSLibNodeVmwareSoapApiHelpersService } from './services/anyopsos-lib-node-vmware-soap-api-helpers.service';
import { AnyOpsOSLibNodeVmwareSoapApiService } from './services/anyopsos-lib-node-vmware-soap-api.service';
import { AnyOpsOSLibNodeVmwareService } from './services/anyopsos-lib-node-vmware.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class AnyOpsOSLibNodeVmwareModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibNodeVmwareModule,
              private readonly LibBootstrap: AnyOpsOSLibBootstrapService,
              private readonly LibNodeVmwareConnectionsState: AnyOpsOSLibNodeVmwareConnectionsStateService,
              private readonly LibNodeVmwareFileSystemHandlers: AnyOpsOSLibNodeVmwareFileSystemHandlersService) {
    console.log('Loading AnyOpsOSLibNodeVmwareModule');

    if (parentModule) {
      // throw new Error(
      // 'AnyOpsOSLibNodeVmwareModule is already loaded. You should not import it manually.');
    }

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

  static forRoot(): ModuleWithProviders<AnyOpsOSLibNodeVmwareModule> {
    return {
      ngModule: AnyOpsOSLibNodeVmwareModule,
      providers: [
        AnyOpsOSLibNodeVmwareConnectionsStateService,
        AnyOpsOSLibNodeVmwareFileSystemHandlersService,
        AnyOpsOSLibNodeVmwareFileSystemService,
        AnyOpsOSLibNodeVmwareHelpersService,
        AnyOpsOSLibNodeVmwareSoapApiHelpersService,
        AnyOpsOSLibNodeVmwareSoapApiService,
        AnyOpsOSLibNodeVmwareService
      ]
    };
  }

}
