import {NgModule, ModuleWithProviders, Optional, SkipSelf} from '@angular/core';

import {AnyOpsOSLibFileSystemUiModule} from '@anyopsos/lib-file-system-ui';
import {AnyOpsOSLibWorkspaceModule} from '@anyopsos/lib-workspace';
import {AnyOpsOSLibModalModule} from '@anyopsos/lib-modal';
import {AnyOpsOSLibApplicationModule} from '@anyopsos/lib-application';

import {AnyOpsOSLibFileSystemService} from './services/anyopsos-lib-file-system.service';
import {AnyOpsOSLibFileSystemFileHandlersService} from './services/anyopsos-lib-file-system-file-handlers.service';

@NgModule({
  declarations: [],
  imports: [
    AnyOpsOSLibFileSystemUiModule,
    AnyOpsOSLibWorkspaceModule,
    AnyOpsOSLibModalModule,
    AnyOpsOSLibApplicationModule
  ],
  exports: []
})
export class AnyOpsOSLibFileSystemModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibFileSystemModule,
              private readonly FileSystemFileHandlers: AnyOpsOSLibFileSystemFileHandlersService) {
    console.log('Loading AnyOpsOSLibFileSystemModule');

    if (parentModule) {
      //throw new Error(
        //'AnyOpsOSLibFileSystemModule is already loaded. You should not import it manually.');
    }

    // This allows to manage local file and folders
    this.FileSystemFileHandlers.registerFileSystemUiHandlers();
  }

  static forRoot(): ModuleWithProviders<AnyOpsOSLibFileSystemModule> {
    return {
      ngModule: AnyOpsOSLibFileSystemModule,
      providers: [
        AnyOpsOSLibFileSystemService,
        AnyOpsOSLibFileSystemFileHandlersService
      ]
    };
  }

}
