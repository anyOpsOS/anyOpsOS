import fs from 'fs-extra';

// TODO ESM
const {readFile} = fs;

import {runInDocker} from '../utils.js';
import {INTERNAL_PATH_CWD} from '../constants.js';

export class BuildModals {

  constructor() {

  }

  async build() {
    await this.buildodals();
  }

  private async buildodals() {

    // Build others
    const data = await readFile(`${INTERNAL_PATH_CWD}/angular.json`, 'utf8');
    const ngCli = JSON.parse(data);

    for (const project of Object.keys(ngCli.projects)) {

      // Perform build operation only on applications not already built
      if (!project.startsWith('anyopsos-modal-')) continue;

      await runInDocker(`ng build ${project}`);
      /*await awaitSpawn('npm.cmd', ['run', 'ng', 'build', project], {
        cwd: `${process.cwd()}/src/frontend`,
        stdio: 'inherit'
      });*/
    }
  }

}
