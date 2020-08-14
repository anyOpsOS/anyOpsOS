import {request, Agent} from 'https';

import {AOO_FILESYSTEM_HOST, AOO_FILESYSTEM_PORT, AOO_AUTH_HOST, AOO_AUTH_PORT, SSL_AUTH_CERT_KEY, SSL_AUTH_CERT} from '@anyopsos/module-sys-constants';
import {BackendResponse} from '@anyopsos/backend-core/app/types/backend-response';

export class AnyOpsOSSysApiCallerModule {

  constructor() {
  }

  /**
   * This method is used to contact with other anyOpsOS APIs.
   * Examples:
   * - Auth API -> Filesystem API: To create user workspaces
   * - Core API -> Auth API: To access a workspace credentials and connect agains a node
   * ...
   *
   * If userUuid is passed, it will impersonate this user
   */
  call(api: 'filesystem' | 'auth', method: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE', url: string, bodyData?: any, userUuid?: string): Promise<BackendResponse> {
    const options = {
      hostname: api === 'filesystem' ? AOO_FILESYSTEM_HOST : AOO_AUTH_HOST,
      port: api === 'filesystem' ? AOO_FILESYSTEM_PORT : AOO_AUTH_PORT,
      path: url,
      method,
      headers: {},
      key: SSL_AUTH_CERT_KEY,
      cert: SSL_AUTH_CERT,
      // Disable session caching
      agent: new Agent({
        maxCachedSessions: 0
      }),
      // Certificate validation
      strictSSL: true
    }

    if (bodyData) {
      options.headers = {
        'User-Agent': 'Node.js/https',
        'Content-Type': 'application/json',
        'Content-Length': JSON.stringify(bodyData).length
      }
    }

    if (userUuid) options.headers = {...options.headers, 'anyopsos-impersonate': userUuid}

    return new Promise((resolve, reject) => {
      const requestCall = request(options, (res) => {
        const chunks: Uint8Array[] = [];

        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const response: BackendResponse = JSON.parse(Buffer.concat(chunks).toString());
          if (response.status === 'error') return reject(response.data);
          return resolve(response.data)
        });
        res.on('error', (err) => reject(err));
      });

      if (bodyData) requestCall.write(JSON.stringify(bodyData));
      requestCall.end();
    });
  }

}
