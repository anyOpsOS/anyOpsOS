import {request} from 'https';

import {AOO_FILESYSTEM_HOST, AOO_FILESYSTEM_PORT, AOO_AUTH_HOST, AOO_AUTH_PORT} from '@anyopsos/module-sys-constants';
import {BackendResponse} from '@anyopsos/backend-core/app/types/backend-response';

export class AnyOpsOSSysApiCallerModule {

  constructor() {
  }
  
  call(api: 'filesystem' | 'auth', method: 'GET' | 'PUT' | 'POST' | 'PATH' | 'DELETE', url: string, body?: any): Promise<BackendResponse> {
    console.log('calling');
    const options = {
      hostname: api === 'filesystem' ? AOO_FILESYSTEM_HOST : AOO_AUTH_HOST,
      port: api === 'filesystem' ? AOO_FILESYSTEM_PORT : AOO_AUTH_PORT,
      path: url,
      method,
      body
    }

    console.log(options);

    return new Promise((resolve, reject) => {
      request(options, (res) => {
        let data: unknown = '';
        res.on('data', (chunk) => {
          console.log(chunk);
          data += chunk
        });
        res.on('end', () => resolve(data as BackendResponse));
      }).on('error', (err) => reject(err)).end();
    });
  }

}
