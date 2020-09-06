import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnyOpsOSLibAngularMaterialModule } from '@anyopsos/lib-angular-material';

import { AnyOpsOSLibModalHelpersService } from './services/anyopsos-lib-modal-helpers.service';
import { AnyOpsOSLibModalRegisteredStateService } from './services/anyopsos-lib-modal-registered-state.service';
import { AnyOpsOSLibModalService } from './services/anyopsos-lib-modal.service';
import { BodyComponent } from './components/body/body.component';
import { ButtonsComponent } from './components/buttons/buttons.component';

@NgModule({
  declarations: [
    BodyComponent,
    ButtonsComponent
  ],
  imports: [
    CommonModule,

    // Shared module import
    AnyOpsOSLibAngularMaterialModule
  ],
  exports: [
    BodyComponent,
    ButtonsComponent
  ]
})
export class AnyOpsOSLibModalModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibModalModule) {
    console.log('Loading AnyOpsOSLibModalModule');

    if (parentModule) {
      // throw new Error(
      // 'AnyOpsOSLibModalModule is already loaded. You should not import it manually.');
    }
  }

  static forRoot(): ModuleWithProviders<AnyOpsOSLibModalModule> {
    return {
      ngModule: AnyOpsOSLibModalModule,
      providers: [
        AnyOpsOSLibModalService,
        AnyOpsOSLibModalHelpersService,
        AnyOpsOSLibModalRegisteredStateService
      ]
    };
  }

}
