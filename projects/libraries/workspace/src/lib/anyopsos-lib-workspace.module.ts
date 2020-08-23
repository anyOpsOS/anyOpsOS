import {NgModule, ModuleWithProviders, Optional, SkipSelf} from '@angular/core';

import {AnyOpsOSLibWorkspaceService} from './services/anyopsos-lib-workspace.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class AnyOpsOSLibWorkspaceModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibWorkspaceModule) {
    console.log('Loading AnyOpsOSLibWorkspaceModule');

    if (parentModule) {
      //throw new Error(
        //'AnyOpsOSLibWorkspaceModule is already loaded. You should not import it manually.');
    }
  }

  static forRoot(): ModuleWithProviders<AnyOpsOSLibWorkspaceModule> {
    return {
      ngModule: AnyOpsOSLibWorkspaceModule,
      providers: [
        AnyOpsOSLibWorkspaceService
      ]
    };
  }

}
