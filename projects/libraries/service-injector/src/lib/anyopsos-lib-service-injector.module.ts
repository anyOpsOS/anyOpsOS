import {NgModule, ModuleWithProviders, Optional, SkipSelf} from '@angular/core';

import {AnyOpsOSLibServiceInjectorService} from './services/anyopsos-lib-service-injector.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class AnyOpsOSLibServiceInjectorModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibServiceInjectorModule) {
    console.log('Loading AnyOpsOSLibServiceInjectorModule');

    if (parentModule) {
      //throw new Error(
        //'AnyOpsOSLibServiceInjectorModule is already loaded. You should not import it manually.');
    }

  }

  static forRoot(): ModuleWithProviders<AnyOpsOSLibServiceInjectorModule> {
    return {
      ngModule: AnyOpsOSLibServiceInjectorModule,
      providers: [
        AnyOpsOSLibServiceInjectorService
      ]
    };
  }
}
