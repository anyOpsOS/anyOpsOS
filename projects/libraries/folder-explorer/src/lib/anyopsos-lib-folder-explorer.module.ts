import {NgModule, ModuleWithProviders, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {AnyOpsOSLibAngularMaterialModule} from '@anyopsos/lib-angular-material';
import {AnyOpsOSLibFolderModule} from '@anyopsos/lib-folder';

import {AnyOpsOSLibFolderExplorerService} from './services/anyopsos-lib-folder-explorer.service';
import {FolderExplorerMainComponent} from './components/main.component';
import {FolderExplorerBodyComponent} from './components/body/body.component';
import {FolderExplorerActionsComponent} from './components/actions/actions.component';

@NgModule({
  declarations: [
    FolderExplorerBodyComponent,
    FolderExplorerActionsComponent,
    FolderExplorerMainComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    // Shared module import
    AnyOpsOSLibAngularMaterialModule,
    AnyOpsOSLibFolderModule
  ],
  exports: [
    FolderExplorerMainComponent
  ]
})

export class AnyOpsOSLibFolderExplorerModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibFolderExplorerModule) {
    console.log('Loading AnyOpsOSLibFolderExplorerModule');

    if (parentModule) {
      //throw new Error(
        //'AnyOpsOSLibFolderExplorerModule is already loaded. You should not import it manually.');
    }
  }

  static forRoot(): ModuleWithProviders<AnyOpsOSLibFolderExplorerModule> {
    return {
      ngModule: AnyOpsOSLibFolderExplorerModule,
      providers: [
        AnyOpsOSLibFolderExplorerService
      ]
    };
  }

}
