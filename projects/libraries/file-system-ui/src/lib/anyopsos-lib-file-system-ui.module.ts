import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';

import { AnyOpsOSLibFileSystemUiService } from './services/anyopsos-lib-file-system-ui.service';
import { AnyOpsOSLibFileSystemUiHelpersService } from './services/anyopsos-lib-file-system-ui-helpers.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class AnyOpsOSLibFileSystemUiModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibFileSystemUiModule) {
    if (parentModule) {
      // throw new Error(
      // 'AnyOpsOSLibFileSystemUiModule is already loaded. You should not import it manually.');
    }
  }

  static forRoot(): ModuleWithProviders<AnyOpsOSLibFileSystemUiModule> {
    return {
      ngModule: AnyOpsOSLibFileSystemUiModule,
      providers: [
        AnyOpsOSLibFileSystemUiService,
        AnyOpsOSLibFileSystemUiHelpersService
      ]
    };
  }

}
