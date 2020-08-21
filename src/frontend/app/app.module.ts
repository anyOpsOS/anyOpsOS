import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ApplicationRef, Compiler, Injector, ComponentFactory, NgModuleFactory, NgModuleRef, ComponentFactoryResolver } from '@angular/core';

import { SystemJsLoaderService } from './services/system-js-loader.service';

// Prepare output for SystemJS
declare const window: any;

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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

  ngDoBootstrap(appRef: ApplicationRef) {

    const currentLocation = `${location.protocol}//${location.hostname}${(location.port ? ':' + location.port: '')}`;

    return window.System.import(`${currentLocation}/api/file/${encodeURIComponent('/bin/libraries/anyopsos-lib-bootstrap.umd.js')}`).then((moduleToCompile: any) => {

      // TODO This will only work if the application exposes only one Module and one Component
      const bootstrapModule: string = Object.keys(moduleToCompile).find((entry: string) => entry.endsWith('Module'));
      const bootstrapComponent: string = Object.keys(moduleToCompile).find((entry: string) => entry.endsWith('Component'));

      let moduleFactory: NgModuleFactory<any>;

      if (moduleToCompile[bootstrapModule] instanceof NgModuleFactory) {
        moduleFactory = moduleToCompile[bootstrapModule];
      } else {
        moduleFactory = this.compiler.compileModuleSync(moduleToCompile[bootstrapModule]);
      }

      console.log(moduleToCompile);
      console.log(moduleFactory);

      const moduleRef: NgModuleRef<any> = moduleFactory.create(this.injector);
      const resolver: ComponentFactoryResolver = moduleRef.componentFactoryResolver;

      const applicationComponentFactory: ComponentFactory<any> = resolver.resolveComponentFactory(moduleToCompile[bootstrapComponent]);

      // Bootstrap application from lazyload Component
      if (document.querySelector(applicationComponentFactory.selector)) {
        appRef.bootstrap(applicationComponentFactory);
      }

    });

  }
}