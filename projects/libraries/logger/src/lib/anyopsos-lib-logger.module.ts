import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { LoggerModule } from 'ngx-logger';

import { AnyOpsOSLibAngularMaterialModule } from '@anyopsos/lib-angular-material';

import { AnyOpsOSLibLoggerService } from './services/anyopsos-lib-logger.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    LoggerModule,

    // Shared module import
    AnyOpsOSLibAngularMaterialModule
  ],
  exports: []
})
export class AnyOpsOSLibLoggerModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibLoggerModule) {
    console.log('Loading AnyOpsOSLibLoggerModule');

    if (parentModule) {
      // throw new Error(
      // 'AnyOpsOSLibLoggerModule is already loaded. You should not import it manually.');
    }
  }

  static forRoot(): ModuleWithProviders<AnyOpsOSLibLoggerModule> {
    return {
      ngModule: AnyOpsOSLibLoggerModule,
      providers: [
        AnyOpsOSLibLoggerService
      ]
    };
  }
}
