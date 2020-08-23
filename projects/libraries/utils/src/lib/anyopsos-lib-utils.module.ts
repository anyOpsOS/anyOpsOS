import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {MonacoEditorModule} from 'ngx-monaco-editor';

import {AnyOpsOSLibAngularMaterialModule} from '@anyopsos/lib-angular-material';

import {AnyOpsOSLibUtilsService} from './services/anyopsos-lib-utils.service';
import {NgNoCheck} from './directives/no-check.directive';
import {CapsLockDirective} from './directives/caps-lock.directive';
import {TextInputComponent} from './components/text-input/text-input.component';
import {NoticeBoxComponent} from './components/notice-box/notice-box.component';
import {RelatimeTimePipe} from './pipes/relatime-time.pipe';

@NgModule({
  declarations: [
    NgNoCheck,
    CapsLockDirective,
    TextInputComponent,
    NoticeBoxComponent,
    RelatimeTimePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    MonacoEditorModule,

    // Shared module import
    AnyOpsOSLibAngularMaterialModule
  ],
  providers: [
    AnyOpsOSLibUtilsService
  ],
  exports: [
    NgNoCheck,
    CapsLockDirective,
    TextInputComponent,
    NoticeBoxComponent,
    RelatimeTimePipe
  ]
})
export class AnyOpsOSLibUtilsModule {

  constructor() {
    console.log('Loading AnyOpsOSLibUtilsModule');
  }

}
