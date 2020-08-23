import {NgModule, ModuleWithProviders, Optional, SkipSelf} from '@angular/core';

import {AnyOpsOSLibBootstrapService} from '@anyopsos/lib-bootstrap';

import {AnyOpsOSLibNodeSnmpService} from './services/anyopsos-lib-node-snmp.service';
import {AnyOpsOSLibNodeSnmpApiService} from './services/anyopsos-lib-node-snmp-api.service';
import {AnyOpsOSLibNodeSnmpHelpersService} from './services/anyopsos-lib-node-snmp-helpers.service';
import {AnyOpsOSLibNodeSnmpConnectionsStateService} from './services/anyopsos-lib-node-snmp-connections-state.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class AnyOpsOSLibNodeSnmpModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibNodeSnmpModule,
              private readonly LibBootstrap: AnyOpsOSLibBootstrapService,
              private readonly LibNodeSnmpConnectionsState: AnyOpsOSLibNodeSnmpConnectionsStateService) {
    console.log('Loading AnyOpsOSLibNodeSnmpModule');

    if (parentModule) {
      //throw new Error(
        //'AnyOpsOSLibNodeSnmpModule is already loaded. You should not import it manually.');
    }

    // Initialize connections when user is loggedIn
    this.LibBootstrap.currentBootstrapState.subscribe((data: { appBootstrapped: boolean; }) => {
      if (data.appBootstrapped === true && !this.LibNodeSnmpConnectionsState.getConnectionsInitialized()) {

        // Get Snmp connections
        this.LibNodeSnmpConnectionsState.initConnections();
      }
    });

  }

  static forRoot(): ModuleWithProviders<AnyOpsOSLibNodeSnmpModule> {
    return {
      ngModule: AnyOpsOSLibNodeSnmpModule,
      providers: [
        AnyOpsOSLibNodeSnmpService,
        AnyOpsOSLibNodeSnmpApiService,
        AnyOpsOSLibNodeSnmpHelpersService,
        AnyOpsOSLibNodeSnmpConnectionsStateService
      ]
    };
  }

}
