import {NgModule} from '@angular/core';

import {AnyopsosLibBootstrapService} from '@anyopsos/lib-bootstrap';

import {AnyOpsOSLibNodeSnmpConnectionsStateService} from './services/anyopsos-lib-node-snmp-connections-state.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class AnyOpsOSLibNodeSnmpModule {

  constructor(private readonly LibBootstrap: AnyopsosLibBootstrapService,
              private readonly LibNodeSnmpConnectionsState: AnyOpsOSLibNodeSnmpConnectionsStateService) {

    // Initialize connections when user is loggedIn
    this.LibBootstrap.currentBootstrapState.subscribe((data: { appBootstrapped: boolean; }) => {
      if (data.appBootstrapped === true && !this.LibNodeSnmpConnectionsState.getConnectionsInitialized()) {

        // Get Snmp connections
        this.LibNodeSnmpConnectionsState.initConnections();
      }
    });

  }
}
