// App starts
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {JitCompilerFactory} from '@angular/platform-browser-dynamic';
import {COMPILER_OPTIONS, CompilerFactory, Compiler, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {CookieService} from 'ngx-cookie-service';
import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';
import {MonacoEditorModule} from 'ngx-monaco-editor'; // this is an application required module...

// Internal libraries
import {AnyOpsOSLibAngularMaterialModule} from '@anyopsos/lib-angular-material';
import {AnyOpsOSLibApplicationModule} from '@anyopsos/lib-application';
import {AnyOpsOSLibCredentialModule} from '@anyopsos/lib-credential';
import {AnyOpsOSLibDesktopModule} from '@anyopsos/lib-desktop';

import {AnyOpsOSLibFileModule} from '@anyopsos/lib-file';
import {AnyOpsOSLibFileSystemModule} from '@anyopsos/lib-file-system';
import {AnyOpsOSLibFolderModule} from '@anyopsos/lib-folder';
import {AnyOpsOSLibLoggerModule} from '@anyopsos/lib-logger';
import {AnyOpsOSLibServiceInjectorModule} from '@anyopsos/lib-service-injector';
import {AnyOpsOSLibSelectableService} from '@anyopsos/lib-selectable';
import {AnyOpsOSLibPipesModule} from '@anyopsos/lib-pipes';

import {AnyOpsOSLibSshModule} from '@anyopsos/lib-ssh';
import {AnyOpsOSLibNodeLinuxModule} from '@anyopsos/lib-node-linux';
import {AnyOpsOSLibNodeKubernetesModule} from '@anyopsos/lib-node-kubernetes';
import {AnyOpsOSLibNodeDockerModule} from '@anyopsos/lib-node-docker';
import {AnyOpsOSLibNodeVmwareModule} from '@anyopsos/lib-node-vmware';
import {AnyOpsOSLibNodeNetappModule} from '@anyopsos/lib-node-netapp';
import {AnyOpsOSLibNodeSnmpModule} from '@anyopsos/lib-node-snmp';

// App Components
import {AppComponent} from './components/app.component';
import {InitializeComponent} from './components/initialize/initialize.component';
import {LoginComponent} from './components/login/login.component';

import {CapsLockDirective} from './directives/caps-lock.directive';
import {HttpErrorInterceptor} from './interceptors/http-error-interceptor';
import {SystemJsLoaderService} from './services/system-js-loader.service';

const config: SocketIoConfig = {
  url: window.location.host,
  options: {
    autoConnect: false,
    transports: ['websocket'],
    forceNew: true
  }
};

export function createCompiler(fn: CompilerFactory): Compiler {
  return fn.createCompiler();
}

@NgModule({
  declarations: [
    AppComponent,
    InitializeComponent,
    LoginComponent,
    CapsLockDirective
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    SocketIoModule.forRoot(config),

    AnyOpsOSLibApplicationModule,
    AnyOpsOSLibDesktopModule,
    AnyOpsOSLibFileSystemModule,
    AnyOpsOSLibFileModule,
    AnyOpsOSLibFolderModule,
    AnyOpsOSLibServiceInjectorModule,
    AnyOpsOSLibLoggerModule,
    AnyOpsOSLibAngularMaterialModule,
    AnyOpsOSLibPipesModule,

    AnyOpsOSLibCredentialModule,
    AnyOpsOSLibSshModule,
    AnyOpsOSLibNodeLinuxModule,
    AnyOpsOSLibNodeKubernetesModule,
    AnyOpsOSLibNodeDockerModule,
    AnyOpsOSLibNodeVmwareModule,
    AnyOpsOSLibNodeNetappModule,
    AnyOpsOSLibNodeSnmpModule,

    MonacoEditorModule.forRoot()
  ],
  providers: [
    {
      provide: COMPILER_OPTIONS,
      useValue: {},
      multi: true
    },
    {
      provide: CompilerFactory,
      useClass: JitCompilerFactory,
      deps: [COMPILER_OPTIONS]
    },
    {
      provide: Compiler,
      useFactory: createCompiler,
      deps: [CompilerFactory]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    CookieService,
    AnyOpsOSLibSelectableService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  // Initialize libraries with SystemJs
  constructor(private readonly SystemJsLoaderService: SystemJsLoaderService) {

  }

}
