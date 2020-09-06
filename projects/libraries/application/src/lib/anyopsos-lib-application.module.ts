import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResizableModule } from 'angular-resizable-element';

import { AnyOpsOSLibAngularMaterialModule } from '@anyopsos/lib-angular-material';


import { AnyOpsOSLibApplicationService } from './services/anyopsos-lib-application.service';
import { AnyOpsOSLibApplicationComponent } from './components/anyopsos-lib-application.component';

@NgModule({
  declarations: [
    AnyOpsOSLibApplicationComponent
  ],
  imports: [
    CommonModule,
    ResizableModule,

    // Shared module import
    AnyOpsOSLibAngularMaterialModule
  ],
  exports: [
    AnyOpsOSLibApplicationComponent
  ]
})
export class AnyOpsOSLibApplicationModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibApplicationModule) {
    console.log('Loading AnyOpsOSLibApplicationModule');

    if (parentModule) {
      // throw new Error(
      // 'AnyOpsOSLibApplicationModule is already loaded. You should not import it manually.');
    }


  }

  static forRoot(): ModuleWithProviders<AnyOpsOSLibApplicationModule> {
    return {
      ngModule: AnyOpsOSLibApplicationModule,
      providers: [
        AnyOpsOSLibApplicationService
      ]
    };
  }

}
