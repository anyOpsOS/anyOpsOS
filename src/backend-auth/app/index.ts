'use strict';

process.env.AOO_ANYOPSOS_TYPE = 'auth';

import 'reflect-metadata';
import {Init} from './init';
import {App} from './app';

/**
 * Make initial checks
 */
new Init().initialize().then(() => {

  /**
   * Initialize App
   */
  new App().initializeApiServer();
});


