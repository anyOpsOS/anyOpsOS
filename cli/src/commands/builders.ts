import {Stats} from 'fs';
import nexe from 'nexe';
import chalk from 'chalk';
import fs from 'fs-extra';
import rimraf from 'rimraf';
import readLines from 'read-last-lines';

// TODO ESM
const {compile} = nexe;
const {blue, blueBright, red, greenBright} = chalk;
const {pathExistsSync, readdir, stat, truncate, statSync} = fs;

import {BuildModals} from '../scripts/build-modals';
import {BuildExtLibs} from '../scripts/build-ext-libs';
import {BuildLibs} from '../scripts/build-libs';
import {BuildApps} from '../scripts/build-apps';

import {runInDocker} from '../utils';
import {INTERNAL_PATH_CWD, MAIN_PATH_CWD} from '../constants';
import {Types} from '../types/types';

export class Builders {

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
    this.projectPath = `/projects/${this.packageLongType}/${argv.name ? argv.name : argv.moduleName}`;

    if (!argv.prefix) argv.prefix = argv.name;
  }

  // TODO: provably we can do this modifying the angular.json file
  private async removeSourceMaps(filename: string): Promise<void> {
    console.log(blue(`[anyOpsOS Cli. Internals] Removing sourcemap line from bundle.`));

    const lines2nuke = 1;

    return new Promise((resolve, reject) => {
      readLines(filename, lines2nuke).then((lines: string[]) => {
        const toVanquish = lines.length;
        stat(filename, (statsError: Error, stats: Stats) => {
          if (statsError) return reject(statsError);

          truncate(filename, stats.size - toVanquish, (truncateError: Error) => {
            if (truncateError) return reject(truncateError);

            return resolve();
          });
        });
      });
    });
  };

  /**
   * Builder for Library, External-Library, Application & Modal
   */
  async buildFrontendTypes(argv: { type: Types; name?: string; moduleName?: string; prefix?: string; }): Promise<void> {

    this.setArgvData(argv);

    await runInDocker(`mkdir -p ${INTERNAL_PATH_CWD}/.dist/anyOpsOS/fileSystem/filesystem/bin/${this.packageLongType}`);

    // Build specific module
    if (argv.moduleName) {

      // Build
      console.log(blueBright(`[anyOpsOS Cli.] Building anyOpsOS ${this.packageType} ${argv.moduleName}.\n`));

      await runInDocker(`ng build anyopsos-${this.packageType}-${argv.moduleName}`);

      await this.removeSourceMaps(`${MAIN_PATH_CWD}/.dist/${this.packageLongType}/${argv.moduleName}/bundles/anyopsos-${this.packageType}-${argv.moduleName}.umd.js`);

      // Run postbuild script if exists
      if (pathExistsSync(`${MAIN_PATH_CWD}${this.projectPath}/scripts/postbuild.js`)) {

        console.log(blueBright(`[anyOpsOS Cli.] Running anyOpsOS Modal ${argv.moduleName} postbuild script.\n`));
        await import(`${MAIN_PATH_CWD}${this.projectPath}/scripts/postbuild.js`);
      }

      // Copy to filesystem
      console.log(blue(`[anyOpsOS Cli. Internals] Copying ${this.packageType} ${argv.moduleName} to anyOpsOS filesystem.\n`));

      await runInDocker(`cp -r \
        ${INTERNAL_PATH_CWD}/.dist/${this.packageLongType}/${argv.moduleName}/bundles/anyopsos-${this.packageType}-${argv.moduleName}.umd.js \
        ${INTERNAL_PATH_CWD}/.dist/anyOpsOS/fileSystem/filesystem/bin/${this.packageLongType}/anyopsos-${this.packageType}-${argv.moduleName}.umd.js`
      );

      return;
    }

    // Build all modules of this type
    console.log(blueBright(`[anyOpsOS Cli.] Building anyOpsOS ${this.packageLongType}.\n`));
    if (this.packageType === 'modal') await new BuildModals().build();
    if (this.packageType === 'ext-lib') await new BuildExtLibs().build();
    if (this.packageType === 'lib') await new BuildLibs().build();
    if (this.packageType === 'app') await new BuildApps().build();

    // Run postbuild script if exists
    const projectsFiles = await readdir(`${MAIN_PATH_CWD}/projects/${this.packageLongType}/`);
    await projectsFiles.map(async (directory: string): Promise<void> => {

      if (pathExistsSync(`${MAIN_PATH_CWD}/projects/${this.packageLongType}/${directory}/scripts/postbuild.js`)) {

        console.log(blueBright(`[anyOpsOS Cli.] Running anyOpsOS ${this.packageType} ${directory} postbuild script.\n`));
        await import(`${MAIN_PATH_CWD}/projects/${this.packageLongType}/${directory}/scripts/postbuild.js`);
      }

    });

    // Copy to filesystem
    const directoryFiles = await readdir(`${MAIN_PATH_CWD}/.dist/${this.packageLongType}/`);
    for (const directory of directoryFiles) {
      await this.removeSourceMaps(`${MAIN_PATH_CWD}/.dist/${this.packageLongType}/${directory}/bundles/anyopsos-${this.packageType}-${directory}.umd.js`);

      console.log(blue(`[anyOpsOS Cli. Internals] Copying ${this.packageType} ${directory} to anyOpsOS filesystem.`));
      await runInDocker(`cp -r \
        ${INTERNAL_PATH_CWD}/.dist/${this.packageLongType}/${directory}/bundles/anyopsos-${this.packageType}-${directory}.umd.js \
        ${INTERNAL_PATH_CWD}/.dist/anyOpsOS/fileSystem/filesystem/bin/${this.packageLongType}/anyopsos-${this.packageType}-${directory}.umd.js`
      );

    }

    console.log('\n');
  }

  /**
   * Builder for Websockets, Apis, Api-Middlewares & Modules
   */
  async buildBackendTypes(argv: { type: Types; name?: string; moduleName?: string; prefix?: string; }): Promise<void> {

    this.setArgvData(argv);

    // Build specific module
    if (argv.moduleName) {

      // Build
      console.log(blueBright(`[anyOpsOS Cli.] Building anyOpsOS ${this.packageType} ${argv.moduleName}.\n`));
      await runInDocker(`tsc --build ${INTERNAL_PATH_CWD}${this.projectPath}/tsconfig.json`);

      // Copy package.json
      await runInDocker(`cp \
        ${INTERNAL_PATH_CWD}${this.projectPath}/package.json \
        ${INTERNAL_PATH_CWD}/.dist/${this.packageLongType}/${argv.moduleName}/`
      );

      // Copy to filesystem
      console.log(blue(`[anyOpsOS Cli. Internals] Copying ${this.packageType} ${argv.moduleName} to anyOpsOS filesystem.\n`));

      await runInDocker(`mkdir -p ${INTERNAL_PATH_CWD}/.dist/anyOpsOS/fileSystem/filesystem/bin/${this.packageLongType}/${argv.moduleName}`);
      await runInDocker(`cp -r \
        ${INTERNAL_PATH_CWD}/.dist/${this.packageLongType}/${argv.moduleName}/* \
        ${INTERNAL_PATH_CWD}/.dist/anyOpsOS/fileSystem/filesystem/bin/${this.packageLongType}/${argv.moduleName}`
      );

      return;
    }

    // Build all modules of this type
    console.log(blueBright(`[anyOpsOS Cli.] Building anyOpsOS ${this.packageLongType}.\n`));
    const projectsFiles = await readdir(`${MAIN_PATH_CWD}/projects/${this.packageLongType}/`);

    for (const directory of projectsFiles) {

      const isDirectory: boolean = statSync(`${MAIN_PATH_CWD}/projects/${this.packageLongType}/${directory}`).isDirectory();
      if (!isDirectory) continue;

      console.log(blueBright(`[anyOpsOS Cli.] Building ${this.packageLongType} ${directory}.\n`));
      await runInDocker(`tsc --build ${INTERNAL_PATH_CWD}/projects/${this.packageLongType}/${directory}/tsconfig.json`);

      // Copy package.json
      await runInDocker(`cp \
        ${INTERNAL_PATH_CWD}/projects/${this.packageLongType}/${directory}/package.json \
        ${INTERNAL_PATH_CWD}/.dist/${this.packageLongType}/${directory}/`
      );
    }

    // Copy to filesystem
    console.log(blue(`[anyOpsOS Cli. Internals] Copying ${this.packageLongType} to anyOpsOS filesystem.\n`));
    await runInDocker(`mkdir -p ${INTERNAL_PATH_CWD}/.dist/anyOpsOS/fileSystem/filesystem/bin/${this.packageLongType}/`);
    await runInDocker(`cp -r \
      ${INTERNAL_PATH_CWD}/.dist/${this.packageLongType} \
      ${INTERNAL_PATH_CWD}/.dist/anyOpsOS/fileSystem/filesystem/bin/`
    );

    console.log('\n');
  }

  async buildFrontend(): Promise<void> {
    console.log(blueBright(`[anyOpsOS Cli.] Building anyOpsOS Frontend.\n`));
    await runInDocker('node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build');
    console.log(greenBright(`[anyOpsOS Cli.] Successfully built anyOpsOS Frontend.\n`));
  }

  async buildBackend(): Promise<void> {
    console.log(blueBright(`[anyOpsOS Cli.] Building anyOpsOS Backend FileSystem.\n`));
    await runInDocker('tsc --build src/backend-fileSystem/tsconfig.json');
    console.log(greenBright(`[anyOpsOS Cli.] Successfully built anyOpsOS Backend FileSystem.\n`));

    console.log(blueBright(`[anyOpsOS Cli.] Building anyOpsOS Backend Auth.\n`));
    await runInDocker('tsc --build src/backend-auth/tsconfig.json');
    console.log(greenBright(`[anyOpsOS Cli.] Successfully built anyOpsOS Backend Auth.\n`));

    console.log(blueBright(`[anyOpsOS Cli.] Building anyOpsOS Backend Core.\n`));
    await runInDocker('tsc --build src/backend-core/tsconfig.json');
    console.log(greenBright(`[anyOpsOS Cli.] Successfully built anyOpsOS Backend Core.\n`));


    // Copy package.json
    await runInDocker(`cp \
      ${INTERNAL_PATH_CWD}/src/backend-fileSystem/package.json \
      ${INTERNAL_PATH_CWD}/.dist/anyOpsOS/fileSystem`
    );
    await runInDocker(`cp \
      ${INTERNAL_PATH_CWD}/src/backend-auth/package.json \
      ${INTERNAL_PATH_CWD}/.dist/anyOpsOS/auth`
    );
    await runInDocker(`cp \
      ${INTERNAL_PATH_CWD}/src/backend-core/package.json \
      ${INTERNAL_PATH_CWD}/.dist/anyOpsOS/core`
    );
  }

  async buildAll(): Promise<void> {

    console.log(red(`[anyOpsOS Cli.] Erasing destination folder.\n`));

    // TODO delete this with glob (all but 'cli' folder)
    await rimraf(`${MAIN_PATH_CWD}/.dist/anyOpsOS`, (e) => { if (e) throw e; });
    await rimraf(`${MAIN_PATH_CWD}/.dist/api-middlewares`, (e) => { if (e) throw e; });
    await rimraf(`${MAIN_PATH_CWD}/.dist/apis`, (e) => { if (e) throw e; });
    await rimraf(`${MAIN_PATH_CWD}/.dist/applications`, (e) => { if (e) throw e; });
    await rimraf(`${MAIN_PATH_CWD}/.dist/external-libraries`, (e) => { if (e) throw e; });
    await rimraf(`${MAIN_PATH_CWD}/.dist/libraries`, (e) => { if (e) throw e; });
    await rimraf(`${MAIN_PATH_CWD}/.dist/modals`, (e) => { if (e) throw e; });
    await rimraf(`${MAIN_PATH_CWD}/.dist/modules`, (e) => { if (e) throw e; });
    await rimraf(`${MAIN_PATH_CWD}/.dist/websockets`, (e) => { if (e) throw e; });

    await this.buildBackendTypes({type: 'module'});
    await this.buildBackendTypes({type: 'api-middleware'});
    await this.buildBackendTypes({type: 'api'}).then(async () => await import('../swagger-generator/index'));
    await this.buildBackendTypes({type: 'websocket'});

    await this.buildBackend();

    console.log(blue(`[anyOpsOS Cli. Internals] Generating default anyOpsOS fileSystem.\n`));
    await runInDocker(`cp -r \
      ${INTERNAL_PATH_CWD}/src/backend-fileSystem/app/filesystem/* \
      ${INTERNAL_PATH_CWD}/.dist/anyOpsOS/fileSystem/filesystem/`
    );

    await this.buildFrontendTypes({type: 'library'});
    await this.buildFrontend();
    await this.buildFrontendTypes({type: 'external-library'});
    await this.buildFrontendTypes({type: 'application'});
    await this.buildFrontendTypes({type: 'modal'});
  } 
  
  async buildCli(): Promise<void> {

    console.log(blueBright(`
------------------------------------------------------------------------------
[anyOpsOS Cli.] Building Cli for Windows.
------------------------------------------------------------------------------
`));

    await compile({
      input: `${INTERNAL_PATH_CWD}/.dist/cli/bin/anyopsos.js`,
      targets: ['windows-x64-10.16.0'],
      output: `${INTERNAL_PATH_CWD}/bin/anyopsos`,
      flags: ['-experimental-modules', '--experimental-loader', `${INTERNAL_PATH_CWD}/.dist/cli/src/https-loader.js`, '--experimental-specifier-resolution=node']
    }).then(() => {
      console.log(greenBright(`\n[anyOpsOS Cli.] Successfully built Cli for Windows.\n`));
    });

    console.log(blueBright(`
------------------------------------------------------------------------------
[anyOpsOS Cli.] Building Cli for Linux.
------------------------------------------------------------------------------
`));

    await compile({
      input: `${INTERNAL_PATH_CWD}/.dist/cli/bin/anyopsos.js`,
      targets: ['linux-x64'],
      output: `${INTERNAL_PATH_CWD}/bin/anyopsos`,
      flags: ['-experimental-modules', '--experimental-loader', `${INTERNAL_PATH_CWD}/.dist/cli/src/https-loader.js`, '--experimental-specifier-resolution=node']
    }).then(() => {
      console.log(greenBright(`\n[anyOpsOS Cli.] Successfully built Cli for Linux.\n`));
    });

    console.log(blueBright(`
------------------------------------------------------------------------------
[anyOpsOS Cli.] Building Cli for MacOS.
------------------------------------------------------------------------------
`));

    await compile({
      input: `${INTERNAL_PATH_CWD}/.dist/cli/bin/anyopsos.js`,
      targets: ['macos-x64'],
      output: `${INTERNAL_PATH_CWD}/bin/anyopsos.mac`,
      flags: ['-experimental-modules', '--experimental-loader', `${INTERNAL_PATH_CWD}/.dist/cli/src/https-loader.js`, '--experimental-specifier-resolution=node']
    }).then(() => {
      console.log(greenBright(`\n[anyOpsOS Cli.] Successfully built Cli for MacOS.\n`));
    });

    console.log(blueBright(`
------------------------------------------------------------------------------
[anyOpsOS Cli.] Building Cli for Alpine.
------------------------------------------------------------------------------
`));

    await compile({
      input: `${INTERNAL_PATH_CWD}/.dist/cli/bin/anyopsos.js`,
      targets: ['alpine-x64-10.16.0'],
      output: `${INTERNAL_PATH_CWD}/bin/anyopsos.alpine`,
      flags: ['-experimental-modules', '--experimental-loader', `${INTERNAL_PATH_CWD}/.dist/cli/src/https-loader.js`, '--experimental-specifier-resolution=node']
    }).then(() => {
      console.log(greenBright(`\n[anyOpsOS Cli.] Successfully built Cli for Alpine.\n`));
    });
  
  }
}
