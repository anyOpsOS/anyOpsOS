import {NgModule, ModuleWithProviders, Optional, SkipSelf} from '@angular/core';

import {AnyOpsOSLibUserService} from './services/anyopsos-lib-user.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class AnyOpsOSLibUserModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibUserModule) {
    console.log('Loading AnyOpsOSLibUserModule');

    if (parentModule) {
      throw new Error(
        'AnyOpsOSLibUserModule is already loaded. You should not import it manually.');
    }
  }

  static forRoot(): ModuleWithProviders<AnyOpsOSLibUserModule> {
    return {
      ngModule: AnyOpsOSLibUserModule,
      providers: [
        AnyOpsOSLibUserService
      ]
    };
  }

}
