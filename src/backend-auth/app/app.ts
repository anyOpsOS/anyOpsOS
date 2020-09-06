import log4js, { Logger } from 'log4js';
import { createServer as createServers, Server as Servers, ServerOptions } from 'https';
import { PeerCertificate } from 'tls';
import express, { Application, RequestHandler } from 'express';
import routingControllers, { Action } from 'routing-controllers';
import connectRedis, { RedisStore } from 'connect-redis';
import session from 'express-session';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

// TODO ESM
const { urlencoded, json } = express;
const { getLogger, connectLogger } = log4js;
const { useExpressServer } = routingControllers;
const { frameguard, xssFilter, noSniff, ieNoOpen, hsts } = helmet;

import { AnyOpsOSSysRedisSessionModule } from '@anyopsos/module-sys-redis-session'
import {
  AOO_SESSION_COOKIE,
  AOO_SESSION_COOKIE_SECRET,
  AOO_UNIQUE_COOKIE_NAME,
  SSL_DHPARAM,
  SSL_CA_CERT,
  SSL_AUTH_CERT,
  SSL_AUTH_CERT_KEY,
  AOO_FILESYSTEM_HOST,
  AOO_FILESYSTEM_PORT,
  AOO_CORE_HOST,
  AOO_AUTH_CONTROLLERS,
  AOO_IMPERSONATE_HEADER
} from '@anyopsos/module-sys-constants';

/**
 * App class will create all the backend listeners HTTPS
 */
export class App {
  private readonly sessionCookie: string = AOO_SESSION_COOKIE;
  private readonly sessionSecret: string = AOO_SESSION_COOKIE_SECRET;
  private readonly uniqueCookie: string = AOO_UNIQUE_COOKIE_NAME;
  private readonly sslDhParam: string = SSL_DHPARAM;
  private readonly sslCa: string = SSL_CA_CERT;
  private readonly sslKey: string = SSL_AUTH_CERT_KEY;
  private readonly sslCert: string = SSL_AUTH_CERT;

  private app!: Application;
  private servers!: Servers;
  private logger!: Logger;
  private options!: ServerOptions;
  private RedisStore!: any;
  private sessionStore!: RedisStore;
  private Session!: RequestHandler;

  constructor() {
  }

  async initializeApiServer() {

    this.options = {
      requestCert: true,
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2',
      dhparam: this.sslDhParam,
      ca: this.sslCa,
      cert: this.sslCert,
      key: this.sslKey
    };
    this.RedisStore = connectRedis(session);
    this.sessionStore = new this.RedisStore({
      client: new AnyOpsOSSysRedisSessionModule().Client,
    });
    this.Session = session({
      store: this.sessionStore,
      secret: this.sessionSecret,
      name: this.sessionCookie,
      resave: false,
      saveUninitialized: true,
      rolling: true,
      cookie: {
        expires: new Date(Date.now() + 8 * 60 * 60 * 1000)
      }
    });

    // Start
    await this.createApp();
    this.logging();
    this.createServer();
    this.listen();
    this.errorHandler();
  }

  private async createApp(): Promise<void> {
    this.app = express();
    this.app.use(this.Session);
    this.app.use(compress());
    this.app.use(urlencoded({
      extended: true
    }));
    this.app.use(json({ limit: '50mb' }));
    this.app.use(cookieParser(this.sessionSecret));
    this.app.use(frameguard());
    this.app.use(xssFilter());
    this.app.use(noSniff());
    this.app.use(ieNoOpen());
    this.app.use(hsts({
      maxAge: 10886400000,     // Must be at least 18 weeks to be approved by Google
      includeSubDomains: true, // Must be enabled to be approved by Google
      preload: true
    }));
    this.app.disable('x-powered-by');
    this.app.use(cors());

    this.app.get('/status', (req: express.Request, res: express.Response) => {
      res.send('ok');
    });

    await useExpressServer(this.app, {
      defaultErrorHandler: false,
      defaults: {
        paramOptions: {
          required: true
        }
      },
      // Import APIs from FileSystem Backend
      controllers: AOO_AUTH_CONTROLLERS,
      middlewares: [
        `https://${AOO_FILESYSTEM_HOST}:${AOO_FILESYSTEM_PORT}/api/file/${encodeURIComponent('bin/api-middlewares/final/index.js')}`,
        `https://${AOO_FILESYSTEM_HOST}:${AOO_FILESYSTEM_PORT}/api/file/${encodeURIComponent('bin/api-middlewares/error-handler/index.js')}`
      ],
      authorizationChecker: async (action: Action, roles?: string[]) => {
        // Certificate authentication
        if (action.request.client.authorized) {
          const cert: PeerCertificate = action.request.socket.getPeerCertificate();

          if (cert.subject.CN !== AOO_FILESYSTEM_HOST && cert.subject.CN !== AOO_CORE_HOST) return false;

          // Impersonate userUuid
          if (action.request.headers[AOO_IMPERSONATE_HEADER]) {
            action.request.session.userUuid = action.request.headers[AOO_IMPERSONATE_HEADER];
          } else {
            action.request.session.userUuid = 'internal';
          }

          return true;
        }

        // No legged_in or deleted uniqueId cookie
        if (!action.request.signedCookies[this.uniqueCookie]) {
          this.logger.warn('no_uniqueId_cookie ' + action.request.url);
          return false;
        }

        // Session deleted from redis
        if (!action.request.session.userUuid) {
          this.logger.warn('no_user_id ' + action.request.url);
          return false;
        }

        // Session user_id and uniqueId not match. Modified uniqueId cookie.
        if (action.request.session.userUuid !== action.request.signedCookies[this.uniqueCookie]) {
          this.logger.warn('invalid_uniqueId_cookie ' + action.request.url);
          return false;
        }

        // Success
        return true;
      }
    });

    /*app.use(csrf());

    // Set cookie "XSRF-TOKEN" the new token for csrf
    app.use(function (req, res, next) {
      res.cookie("XSRF-TOKEN", req.csrfToken(), { secure: true });
      return next();
    });

    // Check for csrf codes
    app.use(function (err, req, res, next) {
      if (err.code !== "EBADCSRFTOKEN") { return next(err); }

      // handle CSRF token errors here
      res.status(403);
      res.send("session has expired or form tampered with");
    });*/
  }

  private logging(): void {
    this.logger = getLogger('mainLog');
    this.app.use(connectLogger(this.logger, {
      level: 'trace',
      format: ':remote-addr - :remote-user [:date] \":method :url HTTP/:http-version\"' +
        ' :status :response-time ms - :res[content-length] -  \":referrer\"',
      nolog: '\\.gif|\\.jpg$|\\.js$|\\.png$|\\.css$||\\.woff$'
    }));
  }

  private createServer(): void {
    this.servers = createServers(this.options, this.app);
  }

  private listen(): void {
    this.servers.listen({ host: '0.0.0.0', port: 443 }, () => {
      this.logger.info('Running server on port 443');
    });
  }

  private errorHandler(): void {
    this.servers.on('error', (e: any) => {
      this.logger.error('HTTPS server.listen ERROR: ' + e.code);
    });
  }

}
