import {join} from 'path';

import {AOO_BASE_PATH} from '@anyopsos/module-sys-constants';

export class AnyOpsOSSysGetPathModule {

  constructor() {
  }

  get filesystem(): string {
    return join(AOO_BASE_PATH, '/filesystem/');
  }

  get bin(): string {
    return join(AOO_BASE_PATH, '/filesystem/bin/');
  }

  get etc(): string {
    return join(AOO_BASE_PATH, '/filesystem/etc/');
  }

  get shadow(): string {
    return 'shadow.json';
  }

}
