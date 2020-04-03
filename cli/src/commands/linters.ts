import chalk from 'chalk';
import fs from 'fs-extra';

// TODO ESM
const {blue} = chalk;
const {readdir, statSync} = fs;

import {runInDocker} from '../utils';
import {INTERNAL_PATH_CWD, MAIN_PATH_CWD} from '../constants';
import {Types} from '../types/types';

export class Linters {

  private packageType!: string;
  private packageLongType!: string;
  private packagePrefix!: string;
  private projectPath!: string;

  constructor() {
  }

  private setArgvData(argv: { type: Types; name?: string; moduleName?: string; prefix?: string; }) {
    this.packageType = argv.type === 'library' ? 'lib' :
      argv.type === 'external-library' ? 'ext-lib' :
        argv.type === 'application' ? 'app' :
          argv.type === 'modal' ? 'modal' :
            argv.type === 'api' ? 'api' :
              argv.type === 'module' ? 'module' :
                argv.type === 'websocket' ? 'websocket' :
                  argv.type;
    this.packageLongType = argv.type === 'library' ? 'libraries' :
      argv.type === 'external-library' ? 'external-libraries' :
        argv.type === 'application' ? 'applications' :
          argv.type === 'modal' ? 'modals' :
            argv.type === 'api' ? 'apis' :
              argv.type === 'api-middleware' ? 'api-middlewares' :
                argv.type === 'module' ? 'modules' :
                  argv.type === 'websocket' ? 'websockets' :
                    argv.type;
    this.packagePrefix = argv.type === 'library' ? 'al' :
      argv.type === 'external-library' ? 'ael' :
        argv.type === 'application' ? 'aa' :
          argv.type === 'modal' ? 'am' :
            argv.type;
    this.projectPath = `${MAIN_PATH_CWD}/projects/${this.packageLongType}/${argv.name ? argv.name : argv.moduleName}`;

    if (!argv.prefix) argv.prefix = argv.name;
  }

  /**
   * Linter for Library, External-Library, Application & Modal
   */
  async lintFrontendTypes(argv: { type: Types; name?: string; moduleName?: string; prefix?: string; }): Promise<void> {

    this.setArgvData(argv);

    // Lint specific module
    if (argv.moduleName) {

      return;
    }

    // Lint all modules of this type

  }

  /**
   * Linter for Websockets, Apis, Api-Middlewares & Modules
   */
  async lintBackendTypes(argv: { type: Types; name?: string; moduleName?: string; prefix?: string; }): Promise<void> {

    this.setArgvData(argv);

    // Lint specific module
    if (argv.moduleName) {

      console.log(blue(`[anyOpsOS Cli.] Linting WebSocket ${argv.moduleName}.\n`));
      await runInDocker(`tslint -p ${this.projectPath}/tsconfig.json`);
      return;
    }

    // Lint all modules of this type
    const projectsFiles = await readdir(`${MAIN_PATH_CWD}/projects/${this.packageLongType}/`);

    for (const directory of projectsFiles) {
      const isDirectory: boolean = statSync(`${MAIN_PATH_CWD}/projects/${this.packageLongType}/${directory}`).isDirectory();
      if (!isDirectory) continue;

      console.log(blue(`[anyOpsOS Cli.] Linting ${this.packageType} ${directory}.\n`));
      await runInDocker(`tslint -p ${INTERNAL_PATH_CWD}/projects/${this.packageLongType}/${directory}/tsconfig.json`);
    }

  }

  async lintFrontend(): Promise<void> {
    await runInDocker('ng lint');
  }

  async lintBackend(): Promise<void> {
    await runInDocker('tslint -p src/backend-fileSystem/tsconfig.json');
    await runInDocker('tslint -p src/backend-auth/tsconfig.json');
    await runInDocker('tslint -p src/backend-core/tsconfig.json');
  };

  async lintAll(): Promise<void> {

    await this.lintBackendTypes({type: 'module'});
    await this.lintBackendTypes({type: 'api-middleware'});
    await this.lintBackendTypes({type: 'api'});
    await this.lintBackendTypes({type: 'websocket'});
    await this.lintBackend();

    await this.lintFrontendTypes({type: 'library'});
    await this.lintFrontendTypes({type: 'external-library'});
    await this.lintFrontendTypes({type: 'application'});
    await this.lintFrontendTypes({type: 'modal'});
    await this.lintFrontend();
  };
}
