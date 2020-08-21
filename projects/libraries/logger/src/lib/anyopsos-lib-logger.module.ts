import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {LoggerModule, NgxLoggerLevel, LoggerConfig, NGXLogger} from 'ngx-logger';

import {AnyOpsOSLibAngularMaterialModule} from '@anyopsos/lib-angular-material';

import {AnyOpsOSLibLoggerService} from './services/anyopsos-lib-logger.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    LoggerModule,

    // Shared module import
    AnyOpsOSLibAngularMaterialModule
  ],
  providers: [
    {
      provide: LoggerConfig, useValue: {
        level: NgxLoggerLevel.DEBUG,
        // serverLoggingUrl: '/api/logs',
        // serverLogLevel: NgxLoggerLevel.OFF,
        // disableConsoleLogging" : true
      }
    },
    NGXLogger,
    AnyOpsOSLibLoggerService
  ],
  exports: []
})
export class AnyOpsOSLibLoggerModule {
}
