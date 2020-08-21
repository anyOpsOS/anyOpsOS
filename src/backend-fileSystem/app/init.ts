import {join} from 'path';
import log4js, {Logger} from 'log4js';
import fs from 'fs-extra';

// TODO ESM
const {configure, getLogger} = log4js;
const {ensureDir} = fs;

import {AnyOpsOSSysGetPathModule} from '@anyopsos/module-sys-get-path';


const logger: Logger = getLogger('mainLog');
const GetPathModule: AnyOpsOSSysGetPathModule = new AnyOpsOSSysGetPathModule();

export class Init {

  constructor() {
    configure({
      appenders: {
        console: {type: 'console', level: 'trace'}
      },
      categories: {
        default: {appenders: ['console'], level: 'trace'},
        mainLog: {appenders: ['console'], level: 'trace'},
        file: {appenders: ['console'], level: 'trace'},
        folder: {appenders: ['console'], level: 'trace'},
        configFile: {appenders: ['console'], level: 'trace'}
      }
    });
  }

  /**
   * Checks and creates if required all System folders
   */
  private async checkSystemFolders(): Promise<void> {
    logger.trace(`[FileSystem] -> checkSystemFolders`);

    try {
      await Promise.all([
        ensureDir(join(GetPathModule.bin, 'applications')),
        ensureDir(join(GetPathModule.bin, 'libraries')),
        ensureDir(join(GetPathModule.bin, 'external-libraries')),
        ensureDir(join(GetPathModule.bin, 'modals')),
        ensureDir(join(GetPathModule.bin, 'deps')),
        ensureDir(join(GetPathModule.bin, 'apis')),
        ensureDir(join(GetPathModule.bin, 'api-middlewares')),
        ensureDir(join(GetPathModule.bin, 'modules')),
        ensureDir(join(GetPathModule.bin, 'websockets')),
        ensureDir(join(GetPathModule.filesystem, 'home')),
        ensureDir(join(GetPathModule.filesystem, 'etc')),
        ensureDir(join(GetPathModule.filesystem, 'mnt'))
      ]);
    }
    catch (e) {
      console.log(e);
    }
  }

  /**
   * Main function that launch all system checks
   */
  public async initialize(): Promise<void> {
    logger.trace(`[FileSystem] -> initialize`);

    return Promise.all([
      this.checkSystemFolders()
    ]).then(() => {}).catch((e) => {
      console.log(e);
    });
  }
}
