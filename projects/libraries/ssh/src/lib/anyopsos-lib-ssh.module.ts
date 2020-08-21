import {NgModule} from '@angular/core';

import {AnyopsosLibBootstrapService} from '@anyopsos/lib-bootstrap';

import {AnyOpsOSLibSshConnectionsStateService} from './services/anyopsos-lib-ssh-connections-state.service';
import {AnyOpsOSLibSshFileSystemHandlersService} from './services/anyopsos-lib-ssh-file-system-handlers.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class AnyOpsOSLibSshModule {

  constructor(private readonly LibBoostrap: AnyopsosLibBootstrapService,
              private readonly LibSshConnectionsState: AnyOpsOSLibSshConnectionsStateService,
              private readonly LibSshFileSystemHandlers: AnyOpsOSLibSshFileSystemHandlersService) {

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

}
