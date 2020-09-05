import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule, Compiler, Injector, NgModuleFactory, NgModuleRef} from '@angular/core';

import {SystemJsLoaderService} from './services/system-js-loader.service';

// Prepare output for SystemJS
declare const window: any;

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: []
})
export class AppModule {

  // Initialize libraries with SystemJs
  constructor(private readonly compiler: Compiler,
              private readonly injector: Injector,
              private readonly SystemJsLoader: SystemJsLoaderService) {
  }

  /**
   * Load @anyopsos/lib-loader which will load every library and bootstrap the application {@link AnyOpsOSLibLoaderService#bootstrap}
   */
  ngDoBootstrap() {

    const currentLocation = `${location.protocol}//${location.hostname}${(location.port ? ':' + location.port: '')}`;

    return window.System.import(`${currentLocation}/api/loader//bin/libraries/anyopsos-lib-loader.umd.js`).then((moduleToCompile: any) => {

      const loaderModule: string = Object.keys(moduleToCompile).find((entry: string) => entry.endsWith('Module'));

      let moduleFactory: NgModuleFactory<any>;

      if (moduleToCompile[loaderModule] instanceof NgModuleFactory) {
        moduleFactory = moduleToCompile[loaderModule];
      } else {
        moduleFactory = this.compiler.compileModuleSync(moduleToCompile[loaderModule]);
      }

      const moduleRef: NgModuleRef<any> = moduleFactory.create(this.injector);

    });

  }
}