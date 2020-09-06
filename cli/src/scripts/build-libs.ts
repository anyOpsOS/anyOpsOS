import fs from 'fs-extra';

// TODO ESM
const { readFile } = fs;

import { runInDocker } from '../utils.js';
import { INTERNAL_PATH_CWD } from '../constants.js';

const projectInOrder = [
  'anyopsos-lib-angular-material',
  'anyopsos-lib-pipes',
  'anyopsos-lib-utils',
  'anyopsos-lib-logger',
  'anyopsos-lib-workspace',
  'anyopsos-lib-modal',
  'anyopsos-lib-application',
  'anyopsos-lib-file-system-ui',
  'anyopsos-lib-file-system',
  'anyopsos-lib-selectable',
  'anyopsos-lib-types',
  'anyopsos-lib-user',
  'anyopsos-lib-file',
  'anyopsos-lib-folder',
  'anyopsos-lib-desktop',
  'anyopsos-lib-bootstrap',
  'anyopsos-lib-ssh',
  'anyopsos-lib-credential',
  'anyopsos-lib-node-linux',
  'anyopsos-lib-node-kubernetes',
  'anyopsos-lib-node-docker',
  'anyopsos-lib-node-vmware',
  'anyopsos-lib-node-netapp',
  'anyopsos-lib-node-snmp',
  'anyopsos-lib-node',
  'anyopsos-lib-loader',
];

export class BuildLibs {

  constructor() {

  }

  async build() {
    await this.buildLibs();
  }

  private async buildLibs() {

    // Build projects in order
    for (const project of projectInOrder) {

      await runInDocker(`ng build ${project}`);

      /*await awaitSpawn('npm.cmd', ['run', 'ng', 'build', project], {
        cwd: `${process.cwd()}/src/frontend`,
        stdio: 'inherit'
      });*/

    }

    // Build others
    const data = await readFile(`${INTERNAL_PATH_CWD}/angular.json`, 'utf8');
    const ngCli = JSON.parse(data);

    for (const project of Object.keys(ngCli.projects)) {

      // Perform build operation only on libraries not already built
      if (!project.startsWith('anyopsos-lib-')) continue;
      if (projectInOrder.includes(project)) continue;

      await runInDocker(`ng build ${project}`);
      /*await awaitSpawn('npm.cmd', ['run', 'ng', 'build', project], {
        cwd: `${process.cwd()}/src/frontend`,
        stdio: 'inherit'
      });*/
    }
  }

}
