import socketControllers from 'socket-controllers';
import { Socket } from 'socket.io';
import log4js, { Logger } from 'log4js';

// TODO ESM
const { getLogger } = log4js;
const { SocketController, ConnectedSocket, SocketId, MessageBody, OnMessage, OnDisconnect, ReturnAck, SocketSessionParam } = socketControllers;

import { AnyOpsOSNodeNetappModule } from '@anyopsos/module-node-netapp';
import { BackendResponse } from '@anyopsos/backend-core/app/types/backend-response';

const logger: Logger = getLogger('mainLog');

@SocketController()
export class AnyOpsOSNetappWebsocketController {

  @OnDisconnect()
  disconnect(@SocketId() id: string) {

    // TODO disconnect client sessions
  }

  @OnMessage('[netapp-disconnect]')
  @ReturnAck()
  netappDisconnect(@ConnectedSocket() socket: Socket,
                   @SocketId() id: string,
                   @SocketSessionParam('userUuid') userUuid: string,
                   @SocketSessionParam('sessionId') sessionUuid: string,
                   @MessageBody() connectionData: { connectionUuid: string; workspaceUuid: string; }) {
    logger.info(`[Websocket netapp] -> disconnect -> id [${id}], connectionUuid [${connectionData.connectionUuid}], workspaceUuid [${connectionData.workspaceUuid}]`);

    const NetappModule: AnyOpsOSNodeNetappModule = new AnyOpsOSNodeNetappModule(userUuid, connectionData.workspaceUuid, connectionData.connectionUuid);

    return NetappModule.disconnectConnection().then((result: BackendResponse) => {
      return result;
    }).catch((e: Error) => {
      return { status: 'error', data: e.toString() } as BackendResponse;
    });
  }

  @OnMessage('[netapp-session]')
  @ReturnAck()
  netappNewSession(@ConnectedSocket() socket: Socket,
                   @SocketId() id: string,
                   @SocketSessionParam('userUuid') userUuid: string,
                   @SocketSessionParam('sessionId') sessionUuid: string,
                   @MessageBody() connectionData: { connectionUuid: string; workspaceUuid: string; }) {
    logger.info(`[Websocket netapp] -> newSession -> id [${id}], connectionUuid [${connectionData.connectionUuid}], workspaceUuid [${connectionData.workspaceUuid}]`);

    const NetappModule: AnyOpsOSNodeNetappModule = new AnyOpsOSNodeNetappModule(userUuid, connectionData.workspaceUuid, connectionData.connectionUuid);

    return NetappModule.newConnection().then((result: BackendResponse) => {
      return result;
    }).catch((e: Error) => {
      return { status: 'error', data: e.toString() } as BackendResponse;
    });
  }

}
