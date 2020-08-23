import {NgModule, ModuleWithProviders, Optional, SkipSelf} from '@angular/core';

import {AnyOpsOSLibNodeService} from './services/anyopsos-lib-node.service';
import {AnyOpsOSLibNodeHelpersService} from './services/anyopsos-lib-node-helpers.service';
import {AnyOpsOSLibNodeTemplateHelpersService} from './services/anyopsos-lib-node-template-helpers.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class AnyOpsOSLibNodeModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibNodeModule) {
    console.log('Loading AnyOpsOSLibNodeModule');

    if (parentModule) {
      //throw new Error(
        //'AnyOpsOSLibNodeModule is already loaded. You should not import it manually.');
    }
  }

  static forRoot(): ModuleWithProviders<AnyOpsOSLibNodeModule> {
    return {
      ngModule: AnyOpsOSLibNodeModule,
      providers: [
        AnyOpsOSLibNodeService,
        AnyOpsOSLibNodeHelpersService,
        AnyOpsOSLibNodeTemplateHelpersService
      ]
    };
  }

}
