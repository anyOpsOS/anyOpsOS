import {Compiler, Injectable, Injector, ModuleWithComponentFactories, NgModuleFactory, NgModuleRef} from '@angular/core';

import {AnyOpsOSLibFileSystemService} from '@anyopsos/lib-file-system';
import {AnyOpsOSLibLoggerService} from '@anyopsos/lib-logger';
import {AnyOpsOSLibApplicationService} from '@anyopsos/lib-application';
import {AnyOpsOSLibModalRegisteredStateService} from '@anyopsos/lib-modal';
import {BackendResponse} from '@anyopsos/backend-core/app/types/backend-response';
import {AnyOpsOSFile} from '@anyopsos/backend-core/app/types/anyopsos-file';


declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class AnyOpsOSLibLoaderService {

  constructor(private readonly injector: Injector,
              private readonly compiler: Compiler,
              private readonly logger: AnyOpsOSLibLoggerService,
              private readonly LibFileSystem: AnyOpsOSLibFileSystemService,
              private readonly LibApplication: AnyOpsOSLibApplicationService,
              private readonly ModalRegisteredState: AnyOpsOSLibModalRegisteredStateService) {
  }

  /**
   * Applications
   */
  loadApplications(): Promise<void> {
    const loggerArgs = arguments;

    return new Promise((resolve, reject) => {

      this.LibFileSystem.getFolder('/bin/applications').subscribe(
        (res: BackendResponse & { data: AnyOpsOSFile[]; }) => {
          if (res.status === 'error') return this.logger.fatal('LibLoader', 'Error while getting Installed Applications', loggerArgs, res.data);

          // Register every application
          return Promise.all(
            res.data.map((application: AnyOpsOSFile) => application.fileName.endsWith('.umd.js') ? this.loadApplication(application) : null)
          ).then(() => resolve());

        },
        error => {
          this.logger.error('LibLoader', 'Error while getting installed applications', loggerArgs, error);
          return reject();
        });

    });
  }

  loadApplication(application: AnyOpsOSFile) {

    return new Promise((resolve) => {

      const currentLocation = `${location.protocol}//${location.hostname}${(location.port ? ':' + location.port: '')}`;

      window.System.import(`${currentLocation}/api/file/${encodeURIComponent('/bin/applications/' + application.fileName)}`).then((moduleToCompile) => {

        // This will only work if the application exposes only one Module
        const applicationModule: string = Object.keys(moduleToCompile).find((entry: string) => entry.endsWith('Module'));
        return this.compiler.compileModuleAsync<any>(moduleToCompile[applicationModule]);

      }).then((modFac: NgModuleFactory<any>) => {
        modFac.create(this.injector);

        // Set factory to use in future
        // TODO make this more dynamic
        const applicationUuid: string = application.fileName.replace('.umd.js', '').replace('anyopsos-app-', '');
        this.LibApplication.patchApplication(applicationUuid, 'factory', modFac);

        return resolve();
      });

    });
  }

  /**
   * Modals
   */
  loadModals(): void {

    // Get all modal files
    this.LibFileSystem.getFolder('/bin/modals').subscribe(
      (res: BackendResponse & { data: AnyOpsOSFile[]; }) => {
        if (res.status === 'error') return this.logger.fatal('LibLoader', 'Error while getting Installed Modals', null, res.data);

        this.logger.info('LibLoader', 'Get Installed Modals successfully');

        // Load all modals
        res.data.forEach((value) => {
          if (value.fileName.endsWith('.umd.js')) {
            this.loadModal(value);
          }
        });

      },
      error => {
        this.logger.error('LibLoader', 'Error while getting installed modals', null, error);
      });
  }

  loadModal(modal: AnyOpsOSFile): void {
    const loggerArgs = arguments;

    const currentLocation = `${location.protocol}//${location.hostname}${(location.port ? ':' + location.port: '')}`;

    window.System.import(`${currentLocation}/api/file/${encodeURIComponent('/bin/modals/' + modal.fileName)}`).then((moduleToCompile) => {

      // This will only work if the modal exposes only one Module
      const modalModule: string = Object.keys(moduleToCompile).find((entry: string) => entry.endsWith('Module'));
      return this.compiler.compileModuleAsync<any>(moduleToCompile[modalModule]);

    }).then(async (modFac: NgModuleFactory<any>) => {

      // need to instantiate the Module so we can use it as the provider for the new component
      const factory: ModuleWithComponentFactories<any> = await this.compiler.compileModuleAndAllComponentsAsync<any>(modFac.moduleType);
      const modRef: NgModuleRef<any> = modFac.create(this.injector);

      // Set factory to use in future
      // TODO make this more dynamic
      const moduleId: string = modal.fileName.replace(/^anyopsos-modal-(default-)?/, '').replace('.umd.js', '');
      this.ModalRegisteredState.patchModal(moduleId, 'factory', factory);
      this.ModalRegisteredState.patchModal(moduleId, 'modRef', modRef);

    }).catch((e: Error) => {
      this.logger.error('LibLoader', 'Error while loading modal', loggerArgs, e.message);
    });

  }

}
