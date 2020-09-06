import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';

import { AnyOpsOSLibBootstrapService } from '@anyopsos/lib-bootstrap';

import { AnyOpsOSLibSshService } from './services/anyopsos-lib-ssh.service';
import { AnyOpsOSLibSshHelpersService } from './services/anyopsos-lib-ssh-helpers.service';
import { AnyOpsOSLibSshFileSystemService } from './services/anyopsos-lib-ssh-file-system.service';
import { AnyOpsOSLibSshConnectionsStateService } from './services/anyopsos-lib-ssh-connections-state.service';
import { AnyOpsOSLibSshFileSystemHandlersService } from './services/anyopsos-lib-ssh-file-system-handlers.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class AnyOpsOSLibSshModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibSshModule,
              private readonly LibBoostrap: AnyOpsOSLibBootstrapService,
              private readonly LibSshConnectionsState: AnyOpsOSLibSshConnectionsStateService,
              private readonly LibSshFileSystemHandlers: AnyOpsOSLibSshFileSystemHandlersService) {
    console.log('Loading AnyOpsOSLibSshModule');

    if (parentModule) {
      // throw new Error(
      // 'AnyOpsOSLibSshModule is already loaded. You should not import it manually.');
    }

    // Initialize connections when user is loggedIn
    this.LibBoostrap.currentBootstrapState.subscribe((data: { appBootstrapped: boolean; }) => {
      if (data.appBootstrapped === true && !this.LibSshConnectionsState.getConnectionsInitialized()) {

        // Get SSH & SFTP connections
        this.LibSshConnectionsState.initConnections();

        // This allows to manage file and folders
        this.LibSshFileSystemHandlers.registerFileSystemUiHandlers();
      }
    });

  }

  static forRoot(): ModuleWithProviders<AnyOpsOSLibSshModule> {
    return {
      ngModule: AnyOpsOSLibSshModule,
      providers: [
        AnyOpsOSLibSshService,
        AnyOpsOSLibSshHelpersService,
        AnyOpsOSLibSshFileSystemService,
        AnyOpsOSLibSshConnectionsStateService,
        AnyOpsOSLibSshFileSystemHandlersService
      ]
    };
  }

}
