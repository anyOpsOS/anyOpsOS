import awaitSpawn from 'await-spawn';

import {MAIN_PATH_CWD} from './constants';

export async function runInDocker(command: string): Promise<any> {
  await awaitSpawn('docker', ['exec', '-ti', 'anyopsos-devel', 'sh', '-c', `${command}`], {
    cwd: MAIN_PATH_CWD,
    stdio: 'inherit'
  });
}
