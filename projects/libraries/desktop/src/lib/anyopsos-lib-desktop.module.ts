import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnyOpsOSLibAngularMaterialModule } from '@anyopsos/lib-angular-material';
import { AnyOpsOSLibPipesModule } from '@anyopsos/lib-pipes';
import { AnyOpsOSLibApplicationModule } from '@anyopsos/lib-application';
import { AnyOpsOSLibFolderModule } from '@anyopsos/lib-folder';

import { AnyOpsOSLibDesktopTaskBarService } from './services/anyopsos-lib-desktop-task-bar.service';
import { DesktopComponent } from './components/desktop/desktop.component';
import { StartMenuComponent } from './components/start-menu/start-menu.component';
import { StartMenuItemsComponent } from './components/start-menu-items/start-menu-items.component';
import { TaskBarComponent } from './components/task-bar/task-bar.component';
import { TaskBarItemsComponent } from './components/task-bar-items/task-bar-items.component';

@NgModule({
  declarations: [
    DesktopComponent,
    StartMenuComponent,
    StartMenuItemsComponent,
    TaskBarComponent,
    TaskBarItemsComponent
  ],
  imports: [
    CommonModule,

    // Shared module import
    AnyOpsOSLibAngularMaterialModule,
    AnyOpsOSLibPipesModule,
    AnyOpsOSLibApplicationModule,
    AnyOpsOSLibFolderModule
  ],
  exports: [
    DesktopComponent
  ]
})
export class AnyOpsOSLibDesktopModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibDesktopModule) {
    console.log('Loading AnyOpsOSLibDesktopModule');

    if (parentModule) {
      // throw new Error(
      // 'AnyOpsOSLibDesktopModule is already loaded. You should not import it manually.');
    }

  }

  static forRoot(): ModuleWithProviders<AnyOpsOSLibDesktopModule> {
    return {
      ngModule: AnyOpsOSLibDesktopModule,
      providers: [
        AnyOpsOSLibDesktopTaskBarService
      ]
    };
  }

}
