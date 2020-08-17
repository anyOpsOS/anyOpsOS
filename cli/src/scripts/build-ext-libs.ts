import fs from 'fs-extra';

// TODO ESM
const {readFile} = fs;

import {runInDocker} from '../utils.js';
import {INTERNAL_PATH_CWD} from '../constants.js';

const projectInOrder = [
  'anyopsos-ext-lib-perfect-scrollbar',
  'anyopsos-ext-lib-pako'
];

export class BuildExtLibs {

  constructor() {

  }

  async build() {
    await this.buildExtLibs();
  }

  private async buildExtLibs() {

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
      if (!project.startsWith('anyopsos-ext-lib-')) continue;
      if (projectInOrder.includes(project)) continue;

      await runInDocker(`ng build ${project}`);
      /*await awaitSpawn('npm.cmd', ['run', 'ng', 'build', project], {
        cwd: `${process.cwd()}/src/frontend`,
        stdio: 'inherit'
      });*/
    }
  }

}
