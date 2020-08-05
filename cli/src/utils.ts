import awaitSpawn from 'await-spawn';

import {MAIN_PATH_CWD, INTERNAL_PATH_CWD} from './constants.js';

export async function runInDocker(command: string): Promise<any> {
  if (process.env.RUNINDOCKER) {
    await awaitSpawn('sh', ['-c', `${command}`], {
      cwd: INTERNAL_PATH_CWD,
      stdio: 'inherit'
    }).catch((e: any) => {
      if (e.stderr) return console.log(e.stderr.toString());
      console.log(e);
    });
  } else {
    await awaitSpawn('docker', ['exec', '-ti', 'anyopsos-devel', 'sh', '-c', `${command}`], {
      cwd: MAIN_PATH_CWD,
      stdio: 'inherit'
    }).catch((e: any) => {
      if (e.stderr) throw e.stderr.toString();
      throw e;
    });
  }
  
}
