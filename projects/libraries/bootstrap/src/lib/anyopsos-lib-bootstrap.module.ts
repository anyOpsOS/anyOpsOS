import {NgModule, ModuleWithProviders, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';

import {AnyOpsOSLibAngularMaterialModule} from '@anyopsos/lib-angular-material';
import {AnyOpsOSLibDesktopModule} from '@anyopsos/lib-desktop';

import {AnyOpsOSLibBootstrapService} from './services/anyopsos-lib-bootstrap.service';
import {AppComponent} from './components/app.component';
import {InitializeComponent} from './components/initialize/initialize.component';
import {LoginComponent} from './components/login/login.component';

const config: SocketIoConfig = {
  url: window.location.host,
  options: {
    autoConnect: false,
    transports: ['websocket'],
    forceNew: true
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InitializeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),

    // Shared module import
    AnyOpsOSLibDesktopModule,
    AnyOpsOSLibAngularMaterialModule
  ],
  exports: [
    AppComponent
  ],
  entryComponents: [
    AppComponent
  ]
})
export class AnyOpsOSLibBootstrapModule {

  constructor(@Optional() @SkipSelf() parentModule: AnyOpsOSLibBootstrapModule) {
    console.log('Loading AnyOpsOSLibBootstrapModule');

    if (parentModule) {
      //throw new Error(
        //'AnyOpsOSLibBootstrapModule is already loaded. You should not import it manually.');
    }
  }

  static forRoot(): ModuleWithProviders<AnyOpsOSLibBootstrapModule> {
    return {
      ngModule: AnyOpsOSLibBootstrapModule,
      providers: [
        AnyOpsOSLibBootstrapService
      ]
    };
  }

}
