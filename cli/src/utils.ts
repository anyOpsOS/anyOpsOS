import awaitSpawn from 'await-spawn';

import {MAIN_PATH_CWD, INTERNAL_PATH_CWD} from './constants';

export async function runInDocker(command: string): Promise<any> {
  if (process.env.RUNINDOCKER) {
    await awaitSpawn('sh', ['-c', `${command}`], {
      cwd: INTERNAL_PATH_CWD,
      stdio: 'inherit'
    });
  } else {
    await awaitSpawn('docker', ['exec', '-ti', 'anyopsos-devel', 'sh', '-c', `${command}`], {
      cwd: MAIN_PATH_CWD,
      stdio: 'inherit'
    });
  }
  
}
