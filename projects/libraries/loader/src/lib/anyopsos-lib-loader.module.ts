import {NgModule, Optional, SkipSelf} from '@angular/core';

import {AnyOpsOSLibFileSystemModule} from '@anyopsos/lib-file-system';
import {AnyOpsOSLibFileSystemUiModule} from '@anyopsos/lib-file-system-ui';
import {AnyOpsOSLibLoggerModule} from '@anyopsos/lib-logger';
import {AnyOpsOSLibApplicationModule} from '@anyopsos/lib-application';
import {AnyOpsOSLibModalModule} from '@anyopsos/lib-modal';
import {AnyOpsOSLibWorkspaceModule} from '@anyopsos/lib-workspace';
import {AnyOpsOSLibDesktopModule} from '@anyopsos/lib-desktop';
import {AnyOpsOSLibUserModule} from '@anyopsos/lib-user';
import {AnyOpsOSLibBootstrapModule} from '@anyopsos/lib-bootstrap';

import {AnyOpsOSLibCredentialModule} from '@anyopsos/lib-credential';
import {AnyOpsOSLibSshModule} from '@anyopsos/lib-ssh';
import {AnyOpsOSLibNodeLinuxModule} from '@anyopsos/lib-node-linux';
import {AnyOpsOSLibNodeKubernetesModule} from '@anyopsos/lib-node-kubernetes';
import {AnyOpsOSLibNodeDockerModule} from '@anyopsos/lib-node-docker';
import {AnyOpsOSLibNodeVmwareModule} from '@anyopsos/lib-node-vmware';
import {AnyOpsOSLibNodeNetappModule} from '@anyopsos/lib-node-netapp';
import {AnyOpsOSLibNodeSnmpModule} from '@anyopsos/lib-node-snmp';

import {AnyOpsOSLibUserService} from '@anyopsos/lib-user';
import {AnyOpsOSLibWorkspaceService} from '@anyopsos/lib-workspace';
import {AnyOpsOSLibBootstrapService} from '@anyopsos/lib-bootstrap';
import {AnyOpsOSLibDesktopTaskBarService} from '@anyopsos/lib-desktop';

import {AnyOpsOSLibLoaderService} from './services/anyopsos-lib-loader.service';

@NgModule({
  declarations: [],
  imports: [
    AnyOpsOSLibFileSystemModule.forRoot(),
    AnyOpsOSLibLoggerModule.forRoot(),
    AnyOpsOSLibApplicationModule.forRoot(),
    AnyOpsOSLibModalModule.forRoot(),
    AnyOpsOSLibWorkspaceModule.forRoot(),
    AnyOpsOSLibFileSystemUiModule.forRoot(),
    AnyOpsOSLibApplicationModule.forRoot(),
    AnyOpsOSLibDesktopModule.forRoot(),
    AnyOpsOSLibUserModule.forRoot(),
    AnyOpsOSLibBootstrapModule.forRoot(),

    AnyOpsOSLibCredentialModule.forRoot(),
    AnyOpsOSLibSshModule.forRoot(),
    AnyOpsOSLibNodeLinuxModule.forRoot(),
    AnyOpsOSLibNodeKubernetesModule.forRoot(),
    AnyOpsOSLibNodeDockerModule.forRoot(),
    AnyOpsOSLibNodeVmwareModule.forRoot(),
    AnyOpsOSLibNodeNetappModule.forRoot(),
    AnyOpsOSLibNodeSnmpModule.forRoot(),
  ],
  providers: [
    AnyOpsOSLibLoaderService
  ],
  exports: []
})
export class AnyOpsOSLibLoaderModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibLoaderModule,
              private readonly LibUserState: AnyOpsOSLibUserService,
              private readonly LibWorkspace: AnyOpsOSLibWorkspaceService,
              private readonly LibDesktopTaskBar: AnyOpsOSLibDesktopTaskBarService,
              private readonly LibLoader: AnyOpsOSLibLoaderService,
              private readonly LibBootstrap: AnyOpsOSLibBootstrapService,) {
    console.log('Loading AnyOpsOSLibLoaderModule');

    if (parentModule) {
      throw new Error(
        'AnyOpsOSLibLoaderModule is already loaded. You should not import it manually.');
    }

    // Called when User logsin
    this.LibUserState.currentState.subscribe(async (state) => {
      if (state.userLoggedIn === true) {

        await this.LibWorkspace.loadWorkspaces();

        this.LibDesktopTaskBar.getTaskBarApplications();

        await this.LibLoader.loadApplications();
        await this.LibLoader.loadModals();

        return this.LibBootstrap.init();

      }
    });

    /**
     * Load all libraries and bootstrap the application
     */
    this.LibLoader.loadLibraries().then(() => {
      this.LibLoader.bootstrap();
    });
  }

}
