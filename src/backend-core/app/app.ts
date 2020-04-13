import log4js, {Logger} from 'log4js';
import {createServer as createServers, Server as Servers, ServerOptions, get, Agent} from 'https';
import express, {Application, Request, Response, RequestHandler, NextFunction} from 'express';
import {ServeStaticOptions} from 'serve-static';
import {join} from 'path';
import bodyParser from 'body-parser';
import routingControllers, {Action} from 'routing-controllers';
import socketControllers from 'socket-controllers';
import socketIo from 'socket.io';
import connectRedis, {RedisStore} from 'connect-redis';
import socketRedisStore from 'socket.io-redis';
import session from 'express-session';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import cookie from 'cookie';
import favicon from 'serve-favicon';
import helmet from 'helmet';

// TODO ESM
const {getLogger, connectLogger} = log4js;
const expressStatic = express.static;
const {urlencoded, json} = bodyParser;
const {useExpressServer} = routingControllers;
const {useSocketServer} = socketControllers;
const {frameguard, xssFilter, noSniff, ieNoOpen, hsts} = helmet;

import {AnyOpsOSSysRedisSessionModule} from '@anyopsos/module-sys-redis-session'
import {AOO_SESSION_COOKIE, AOO_SESSION_COOKIE_SECRET, AOO_UNIQUE_COOKIE_NAME, SSL_DHPARAM, SSL_CA_CERT, SSL_CORE_CERT, SSL_CORE_CERT_KEY, AOO_FILESYSTEM_HOST, AOO_FILESYSTEM_PORT, AOO_BASE_PATH} from '@anyopsos/module-sys-constants';
import {AnyOpsOSFile} from './types/anyopsos-file';


/**
 * App class will create all the backend listeners HTTPS/WSS
 */
export class App {
  private readonly sessionCookie: string = AOO_SESSION_COOKIE;
  private readonly sessionSecret: string = AOO_SESSION_COOKIE_SECRET;
  private readonly uniqueCookie: string = AOO_UNIQUE_COOKIE_NAME;
  private readonly sslDhParam: string = SSL_DHPARAM;
  private readonly sslCa: string = SSL_CA_CERT;
  private readonly sslKey: string = SSL_CORE_CERT_KEY;
  private readonly sslCert: string = SSL_CORE_CERT;

  // Used when contacting with anyopsos-filesystem API to get the Core APIs and Websockets
  private readonly apiRequestOptions = {
    key: this.sslKey,
    cert: this.sslCert,
    headers: {
      'User-Agent': 'Node.js/https'
    },
    // Disable session caching
    agent: new Agent({
      maxCachedSessions: 0
    }),
    // Certificate validation
    strictSSL: true,
  }

  private app!: Application;
  private servers!: Servers;
  private io!: socketIo.Server;
  private logger!: Logger;
  private options!: ServerOptions;
  private expressOptions!: ServeStaticOptions;
  private RedisStore!: any;
  private sessionStore!: RedisStore;
  private Session!: RequestHandler;

  private redisClients: AnyOpsOSSysRedisSessionModule = new AnyOpsOSSysRedisSessionModule();

  constructor() {
  }

  async initializeApiServer() {
    this.options = {
      minVersion: 'TLSv1.2',
      dhparam: this.sslDhParam,
      ca: this.sslCa,
      cert: this.sslCert,
      key: this.sslKey
    };
    this.expressOptions = {
      index: 'index.html',
      dotfiles: 'ignore',
      etag: false,
      extensions: ['htm', 'html'],
      maxAge: '1s',
      redirect: false,
      setHeaders: (response: Response) => {
        response.set('x-timestamp', Date.now().toString());
      }
    };
    this.RedisStore = connectRedis(session);
    this.sessionStore = new this.RedisStore({
      client: this.redisClients.Client,
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
    await this.sockets();
    this.listen();
    this.errorHandler();
  }

  private async createApp(): Promise<void> {
    this.app = express();
    this.app.use(this.Session);
    this.app.use(compress({
        filter: (request: Request, response: Response) => {
          return (/json|text|javascript|css/).test((response.getHeader('Content-Type') as string));
        },
        level: 9
      }
    ));
    this.app.use(urlencoded({
      extended: true
    }));
    this.app.use(json({limit: '50mb'}));
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
    this.app.use(favicon(join(AOO_BASE_PATH, '/public/favicon.ico')));
    this.app.use(expressStatic(join(AOO_BASE_PATH, '/public'), this.expressOptions));

    this.app.get('/status', (req: express.Request, res: express.Response) => {
      res.send('ok');
    });

    // Get all APIS not used in fileSystem nor Auth backend
    const controllers: string[] = await new Promise((resolve, reject) => {
      get(`https://${AOO_FILESYSTEM_HOST}:${AOO_FILESYSTEM_PORT}/api/folder/${encodeURIComponent('bin/apis')}`, this.apiRequestOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {

          return resolve(
            JSON.parse(data).data
              .filter((file: AnyOpsOSFile) => file.longName.startsWith('d') && !['auth', 'credential', 'vault', 'workspace', 'config-file', 'file', 'folder'].includes(file.fileName))
              .map((file: AnyOpsOSFile) => `https://${AOO_FILESYSTEM_HOST}:${AOO_FILESYSTEM_PORT}/api/file/${ encodeURIComponent(`bin/apis/${file.fileName}/index.js`) }`)
          );
        
        });
      }).on('error', (err) => reject(err));
    });

    await useExpressServer(this.app, {
      defaultErrorHandler: false,
      defaults: {
        paramOptions: {
          required: true
        }
      },
      controllers: controllers,
      middlewares: [
        `https://${AOO_FILESYSTEM_HOST}:${AOO_FILESYSTEM_PORT}/api/file/${encodeURIComponent('bin/api-middlewares/final/index.js')}`,
        `https://${AOO_FILESYSTEM_HOST}:${AOO_FILESYSTEM_PORT}/api/file/${encodeURIComponent('bin/api-middlewares/error-handler/index.js')}`
      ],
      authorizationChecker: async (action: Action, roles?: string[]) => {
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

  private async sockets(): Promise<void> {
    this.io = socketIo(this.servers);

    // Set socket.io adapter to RedisStore
    this.io.adapter(socketRedisStore({
      pubClient: this.redisClients.Pub,
      subClient: this.redisClients.Sub,
      key: 'sio'
    }));

    /**
     * Socket.io middleware to authenticate the client socket
     */
    this.io.use((socket: socketIo.Socket, next: NextFunction) => {
      this.logger.trace('Socket -> socket_id [%s] -> New socket connection received', socket.id);

      const missingCookies = (): void => {
        this.logger.error('Socket -> Use error -> Missing cookie header');
        return next(new Error('missing_cookie_headers'));
      };

      /**
       * Get actual socket session
       */
      const checkSession = (sessionId: string): void => {
        this.logger.trace('Socket -> socket_id [%s] -> Socket checkSession', socket.id);

        this.sessionStore.load(sessionId, (e: Error, sockSession) => {
          try {
            if (!sockSession) throw new Error('session_not_found');
            if (e) throw e;

            if (!sockSession.userUuid) throw new Error('no_user_id');

            sockSession.socketId = socket.id;
            sockSession.sessionId = sessionId;

            this.sessionStore.set(sessionId, sockSession);

            socket.client.request.session = sockSession;

            this.logger.trace('Socket -> socket_id [%s] -> Socket session passed', socket.id);
            return next();

          } catch (e) {

            if (e.message === 'session_not_found') {
              this.logger.warn('Socket -> sessionStore error -> [%s] -> session_not_found', sessionId);
              return next(new Error(e.message));
            }
            if (e.message === 'no_user_id') {
              this.logger.warn('Socket -> sessionStore error -> [%s] -> no_user_id', sessionId);
              return next(new Error(e.message));
            }
            if (e.message === 'no_logged_in') {
              this.logger.warn('Socket -> sessionStore error -> [%s] -> no_logged_in', sessionId);
              return next(new Error(e.message));
            }

            this.logger.error('Socket -> sessionStore error -> ', e);
            return next(new Error('Internal server error'));
          }
        });
      };

      try {

        if (socket.handshake.headers.cookie) {

          this.logger.trace('Socket -> socket_id [%s] -> Socket have header cookies', socket.id);

          // Cookies from browser socket.io
          const socketCookies = cookie.parse(socket.handshake.headers.cookie);
          if (socketCookies[this.sessionCookie]) {

            // Check if signed cookie
            const sid = cookieParser.signedCookie(socketCookies[this.sessionCookie], this.sessionSecret);
            if (!sid) return next(new Error('Session cookie signature is not valid'));
            const uid = cookieParser.signedCookie(socketCookies[this.uniqueCookie], this.sessionSecret);
            if (!uid) return next(new Error('Unique cookie signature is not valid'));

            const sessionId = socketCookies[this.sessionCookie].substring(2, 34);
            return checkSession(sessionId);

          } else {
            return missingCookies();
          }
        } else {
          return missingCookies();
        }

      } catch (err) {

        this.logger.error('Socket -> Use error -> ', err);
        this.logger.error('Socket -> Use error -> ', err.stack);
        return next(new Error('Internal server error'));

      }

    });

    // Get all websockets to be loaded
    const controllers: string[] = await new Promise((resolve, reject) => {
      get(`https://${AOO_FILESYSTEM_HOST}:${AOO_FILESYSTEM_PORT}/api/folder/${encodeURIComponent('bin/websockets')}`, this.apiRequestOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {

          return resolve(
            JSON.parse(data).data
              .filter((file: AnyOpsOSFile) => file.longName.startsWith('d'))
              .map((file: AnyOpsOSFile) => `https://${AOO_FILESYSTEM_HOST}:${AOO_FILESYSTEM_PORT}/api/file/${ encodeURIComponent(`bin/websockets/${file.fileName}/index.js`) }`)
          );
        
        });
      }).on('error', (err) => reject(err));
    });

    await useSocketServer(this.io, {
      controllers: controllers,
    });
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
