import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AnyOpsOSLibAngularMaterialModule} from '@anyopsos/lib-angular-material';
import {AnyOpsOSLibDesktopModule} from '@anyopsos/lib-desktop';
import {AnyOpsOSLibUtilsModule} from '@anyopsos/lib-utils';

import {AppComponent} from './components/app.component';
import {InitializeComponent} from './components/initialize/initialize.component';
import {LoginComponent} from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InitializeComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    // Shared module import
    AnyOpsOSLibAngularMaterialModule,
    AnyOpsOSLibDesktopModule,
    AnyOpsOSLibUtilsModule
  ],
  exports: [
    AppComponent
  ],
  entryComponents: [
    AppComponent
  ]
})
export class AnyOpsOSLibBootstrapModule {

}
