import socketControllers from 'socket-controllers';
import {Socket} from 'socket.io';
import log4js, {Logger} from 'log4js';

// TODO ESM
const {getLogger} = log4js;
const {SocketController, ConnectedSocket, SocketId, MessageBody, OnMessage, OnDisconnect, ReturnAck, SocketSessionParam} = socketControllers;

import {AnyOpsOSNodeKubernetesModule} from '@anyopsos/module-node-kubernetes';
import {BackendResponse} from '@anyopsos/backend-core/app/types/backend-response';


const logger: Logger = getLogger('mainLog');

@SocketController()
export class AnyOpsOSKubernetesWebsocketController {

  @OnDisconnect()
  disconnect(@SocketId() id: string) {

    // TODO disconnect client sessions
  }

  @OnMessage('[kubernetes-disconnect]')
  @ReturnAck()
  kubernetesDisconnect(@ConnectedSocket() socket: Socket,
                       @SocketId() id: string,
                       @SocketSessionParam('userUuid') userUuid: string,
                       @SocketSessionParam('sessionId') sessionUuid: string,
                       @MessageBody() connectionData: { connectionUuid: string; workspaceUuid: string; }) {
    logger.info(`[Websocket kubernetes] -> disconnect -> id [${id}], connectionUuid [${connectionData.connectionUuid}], workspaceUuid [${connectionData.workspaceUuid}]`);

    const KubernetesModule: AnyOpsOSNodeKubernetesModule = new AnyOpsOSNodeKubernetesModule(userUuid, connectionData.workspaceUuid, connectionData.connectionUuid);

    return KubernetesModule.disconnectConnection().then((result: BackendResponse) => {
      return result;
    }).catch((e: Error) => {
      return {status: 'error', data: e.toString()} as BackendResponse;
    });
  }

  @OnMessage('[kubernetes-session]')
  @ReturnAck()
  kubernetesNewSession(@ConnectedSocket() socket: Socket,
                       @SocketId() id: string,
                       @SocketSessionParam('userUuid') userUuid: string,
                       @SocketSessionParam('sessionId') sessionUuid: string,
                       @MessageBody() connectionData: { connectionUuid: string; workspaceUuid: string; }) {
    logger.info(`[Websocket kubernetes] -> newSession -> id [${id}], connectionUuid [${connectionData.connectionUuid}], workspaceUuid [${connectionData.workspaceUuid}]`);

    const KubernetesModule: AnyOpsOSNodeKubernetesModule = new AnyOpsOSNodeKubernetesModule(userUuid, connectionData.workspaceUuid, connectionData.connectionUuid);

    return KubernetesModule.newConnection().then((result: BackendResponse) => {
      return result;
    }).catch((e: Error) => {
      return {status: 'error', data: e.toString()} as BackendResponse;
    });
  }

}
