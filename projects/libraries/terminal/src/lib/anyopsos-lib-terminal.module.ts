import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnyOpsOSLibTerminalService } from './services/anyopsos-lib-terminal.service';
import { TerminalComponent } from './components/terminal.component';

@NgModule({
  declarations: [
    TerminalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TerminalComponent
  ]
})
export class AnyOpsOSLibTerminalModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibTerminalModule) {
    console.log('Loading AnyOpsOSLibTerminalModule');

    if (parentModule) {
      // throw new Error(
      // 'AnyOpsOSLibTerminalModule is already loaded. You should not import it manually.');
    }

  }

  static forRoot(): ModuleWithProviders<AnyOpsOSLibTerminalModule> {
    return {
      ngModule: AnyOpsOSLibTerminalModule,
      providers: [
        AnyOpsOSLibTerminalService
      ]
    };
  }
}
