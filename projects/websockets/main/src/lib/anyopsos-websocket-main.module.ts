import {SocketController, SocketId, OnConnect, OnDisconnect, ConnectedSocket} from 'socket-controllers';
import {Socket} from 'socket.io';
import log4js, {Logger} from 'log4js';

// TODO ESM
const {getLogger} = log4js;

const logger: Logger = getLogger('mainLog');

@SocketController()
export class AnyOpsOSMainWebsocketController {

  @OnConnect()
  connection(@SocketId() id: string,
             @ConnectedSocket() socket: Socket) {
    logger.info(`[Socket] -> Connected id [${id}]`);

    socket.join(socket.client.request.session.sessionId);
    socket.join('user-' + socket.client.request.session.user_id);

    // TODO
    socket.join('someWorkspaceUuid');
  }

  @OnDisconnect()
  disconnect(@SocketId() id: string) {
    logger.warn(`[Socket] -> Disconnect id [${id}]`);
  }

  // TODO socket on error?

}
