import {join} from 'path';

import {AOO_BASE_PATH} from '@anyopsos/module-sys-constants';

export class AnyOpsOSSysGetPathModule {
  
  // @ts-ignore TODO
  private anyOpsOSPath: string = AOO_BASE_PATH;

  constructor() {
  }

  get filesystem(): string {
    return join(this.anyOpsOSPath, '/filesystem/');
  }

  get bin(): string {
    return join(this.anyOpsOSPath, '/filesystem/bin/');
  }

  get etc(): string {
    return join(this.anyOpsOSPath, '/filesystem/etc/');
  }

  get shadow(): string {
    return 'shadow.json';
  }

}
