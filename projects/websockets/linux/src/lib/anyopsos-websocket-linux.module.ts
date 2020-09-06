import socketControllers from 'socket-controllers';
import { Socket } from 'socket.io';
import log4js, { Logger } from 'log4js';

// TODO ESM
const { getLogger } = log4js;
const { SocketController, ConnectedSocket, SocketId, MessageBody, OnMessage, ReturnAck } = socketControllers;

const logger: Logger = getLogger('mainLog');

@SocketController()
export class AnyOpsOSLinuxWebsocketController {

  // TODO
  @OnMessage('[linux-session]')
  @ReturnAck()
  newMessageReceived(@ConnectedSocket() socket: Socket,
                     @SocketId() id: string,
                     @MessageBody() message: any) {
    logger.info(`[Websocket linux] -> new message -> id [${id}]`);

    socket.emit('message_received', message);
  }

}
