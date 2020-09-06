import { Injectable } from '@angular/core';

import * as angularAnimations from '@angular/animations';
import * as angularCommon from '@angular/common';
import * as angularCommonHttp from '@angular/common/http';
import * as angularCore from '@angular/core';
import * as angularForms from '@angular/forms';
import * as angularPb from '@angular/platform-browser';
import * as angularPbAnimations from '@angular/platform-browser/animations';

import * as Tslib from 'tslib';
import * as rxjs from 'rxjs';
import * as rxjsOperators from 'rxjs/operators';


// Prepare output for SystemJS
declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class SystemJsLoaderService {

  constructor() {

    const originalResolve = window.System.resolve;
    window.System.resolve = function (name: string) {

      const currentLocation = `${location.protocol}//${location.hostname}${(location.port ? ':' + location.port : '')}`;

      // Load anyOpsOS libraries from filesystem
      if (name.startsWith('@anyopsos/lib-')) {
        return `${currentLocation}/api/loader//bin/libraries/${name.replace('@anyopsos/', 'anyopsos-')}.umd.js`;

        // Load anyOpsOS external libraries from filesystem
      } else if (name.startsWith('@anyopsos/ext-lib-')) {
        return `${currentLocation}/api/loader//bin/external-libraries/${name.replace('@anyopsos/', 'anyopsos-')}.umd.js`;

        // Load anyOpsOS modules from filesystem
      } else if (name.startsWith('@anyopsos/module-')) {
        return `${currentLocation}/api/loader//bin/modules/${name.replace('@anyopsos/', 'anyopsos-')}.umd.js`;

        // Load @angular/cdk from filesystem
      } else if (name.startsWith('@angular/cdk/')) {
        return `${currentLocation}/api/loader//bin/deps/cdk/${name.replace('@angular/cdk/', 'cdk-')}.umd.js`;

        // Load @angular/material from filesystem
      } else if (name.startsWith('@angular/material/')) {
        return `${currentLocation}/api/loader//bin/deps/material/${name.replace('@angular/material/', 'material-')}.umd.js`;

        // The rest of @angular, rxjs and tslib libraries are preloaded
      } else if (name.startsWith('@angular/') || name.startsWith('rxjs') || name === 'tslib' || name.startsWith('https://') || name.startsWith('socket.io') || name.startsWith('@anyopsos/frontend')) {
        return originalResolve.apply(this, arguments);

        // Load everything else from filesystem
      } else {
        return `${currentLocation}/api/loader//bin/deps/${name}.js`;
      }
    };

    window.System.set('app:@angular/animations', angularAnimations);
    window.System.set('app:@angular/common', angularCommon);
    window.System.set('app:@angular/common/http', angularCommonHttp);
    window.System.set('app:@angular/core', angularCore);
    window.System.set('app:@angular/forms', angularForms);
    window.System.set('app:@angular/platform-browser', angularPb);
    window.System.set('app:@angular/platform-browser/animations', angularPbAnimations);

    window.System.set('app:tslib', Tslib);
    window.System.set('app:rxjs', rxjs);
    window.System.set('app:rxjs/operators', rxjsOperators);


    window.System.import('@angular/material');
    window.System.import('@angular/cdk');

    window.System.import('@angular/animations');
    window.System.import('@angular/common');
    window.System.import('@angular/common/http');
    window.System.import('@angular/core');
    window.System.import('@angular/forms');
    window.System.import('@angular/platform-browser');
    window.System.import('@angular/platform-browser/animations');

    window.System.import('tslib');
    window.System.import('rxjs');
    window.System.import('rxjs/operators');
  }

}
