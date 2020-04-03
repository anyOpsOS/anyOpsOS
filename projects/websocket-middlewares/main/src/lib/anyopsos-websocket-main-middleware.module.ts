import {Middleware, MiddlewareInterface} from 'socket-controllers';
import {Socket} from 'socket.io';
import log4js, {Logger} from 'log4js';

// TODO ESM
const {getLogger} = log4js;

const logger: Logger = getLogger('mainLog');

@Middleware()
export class AnyOpsOSMainWebsocketMiddleware implements MiddlewareInterface {

  // if websocket connection arrives without an express session, kill it
  use(socket: Socket, next: ((err?: any) => any)): any {

    if (!socket.request.session) {
      logger.warn(`[Socket] -> Unauthorized -> id [${socket.id}]`);
      socket.emit('no_session');
      socket.disconnect(true);
      return next('unauthorized');
    }

    return next();
  }

}
