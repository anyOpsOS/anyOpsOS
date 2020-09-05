import {ApplicationRef, ComponentFactoryResolver, ComponentFactory, Compiler, Injectable, Injector, ModuleWithComponentFactories, NgModuleFactory, NgModuleRef} from '@angular/core';

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

  private bootstrapModule: any;
  private bootstrapModuleRef: NgModuleRef<any>;

  constructor(private readonly appRef: ApplicationRef,
              private readonly injector: Injector,
              private readonly compiler: Compiler,
              private readonly logger: AnyOpsOSLibLoggerService,
              private readonly LibFileSystem: AnyOpsOSLibFileSystemService,
              private readonly LibApplication: AnyOpsOSLibApplicationService,
              private readonly LibModalRegisteredState: AnyOpsOSLibModalRegisteredStateService) {

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

      window.System.import(`${currentLocation}/api/loader//bin/applications/${application.fileName}`).then((moduleToCompile: any) => {

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

    window.System.import(`${currentLocation}/api/loader//bin/modals/${modal.fileName}`).then((moduleToCompile: any) => {

      const modalModule: string = Object.keys(moduleToCompile).find((entry: string) => entry.endsWith('Module'));
      return this.compiler.compileModuleAsync<any>(moduleToCompile[modalModule]);

    }).then(async (modFac: NgModuleFactory<any>) => {

      // need to instantiate the Module so we can use it as the provider for the new component
      const factory: ModuleWithComponentFactories<any> = await this.compiler.compileModuleAndAllComponentsAsync<any>(modFac.moduleType);
      const modRef: NgModuleRef<any> = modFac.create(this.injector);

      // Set factory to use in future
      // TODO make this more dynamic
      const moduleId: string = modal.fileName.replace(/^anyopsos-modal-(default-)?/, '').replace('.umd.js', '');
      this.LibModalRegisteredState.patchModal(moduleId, 'factory', factory);
      this.LibModalRegisteredState.patchModal(moduleId, 'modRef', modRef);

    }).catch((e: Error) => {
      this.logger.error('LibLoader', 'Error while loading modal', loggerArgs, e.message);
    });

  }

  /**
   * Libraries
   */
  loadLibraries(): Promise<void> {

    return new Promise((resolve) => {

      // Get all library files
      this.LibFileSystem.getFolder('/bin/libraries').subscribe(
        async (res: BackendResponse & { data: AnyOpsOSFile[]; }) => {
          if (res.status === 'error') return this.logger.fatal('LibLoader', 'Error while getting Installed Libraries', null, res.data);

          this.logger.info('LibLoader', 'Get Installed Libraries successfully');

          for (const value of res.data) {
            if (value.fileName === 'anyopsos-lib-application.umd.js') continue;
            if (value.fileName.endsWith('.umd.js')) await this.loadLib(value);
          }

          return resolve();
        },
        error => {
          this.logger.error('LibLoader', 'Error while getting installed Libraries', null, error);
        });

      });

  }

  async loadLib(library: AnyOpsOSFile): Promise<void> {
    const currentLocation = `${location.protocol}//${location.hostname}${(location.port ? ':' + location.port: '')}`;

    return window.System.import(`${currentLocation}/api/loader//bin/libraries/${library.fileName}`).then(async (moduleToCompile: any) => {

      const modalModule: string = Object.keys(moduleToCompile).find((entry: string) => entry.endsWith('Module'));

      if ((this.injector as any)._def.modules.find((m) => m.name === modalModule) && modalModule !== 'AnyOpsOSLibBootstrapModule') return;

      const modFac: NgModuleFactory<any> = await this.compiler.compileModuleAsync<any>(moduleToCompile[modalModule]);

      console.log(modalModule);
      if (modalModule === 'AnyOpsOSLibBootstrapModule') {
        this.bootstrapModule = moduleToCompile;
        return this.bootstrapModuleRef = modFac.create(this.injector);
      }

      return modFac.create(this.injector);

    });
  }

  bootstrap() {

    const resolver: ComponentFactoryResolver = this.bootstrapModuleRef.componentFactoryResolver;
    const applicationComponentFactory: ComponentFactory<any> = resolver.resolveComponentFactory(this.bootstrapModule.AppComponent);

    this.appRef.bootstrap(applicationComponentFactory);

  }

}
