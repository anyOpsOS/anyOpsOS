import socketContollers from 'socket-controllers';
import { Socket } from 'socket.io';
import log4js, { Logger } from 'log4js';

// TODO ESM
const { getLogger } = log4js;
const { SocketController, ConnectedSocket, SocketId, MessageBody, OnMessage, OnDisconnect, ReturnAck, SocketSessionParam } = socketContollers;

import { AnyOpsOSNodeVmwareModule } from '@anyopsos/module-node-vmware';
import { BackendResponse } from '@anyopsos/backend-core/app/types/backend-response';


const logger: Logger = getLogger('mainLog');

@SocketController()
export class AnyOpsOSVmwareWebsocketController {

  @OnDisconnect()
  disconnect(@SocketId() id: string) {

    // TODO disconnect client sessions with no autoLogin
  }

  @OnMessage('[vmware-disconnect]')
  @ReturnAck()
  vmwareDisconnect(@ConnectedSocket() socket: Socket,
                   @SocketId() id: string,
                   @SocketSessionParam('userUuid') userUuid: string,
                   @SocketSessionParam('sessionId') sessionUuid: string,
                   @MessageBody() connectionData: { connectionUuid: string; workspaceUuid: string; }) {
    logger.info(`[Websocket vmware] -> disconnect -> id [${id}], connectionUuid [${connectionData.connectionUuid}], workspaceUuid [${connectionData.workspaceUuid}]`);

    const VmwareModule: AnyOpsOSNodeVmwareModule = new AnyOpsOSNodeVmwareModule(userUuid, connectionData.workspaceUuid, connectionData.connectionUuid);

    return VmwareModule.disconnectConnection().then((result: BackendResponse) => {
      return result;
    }).catch((e: Error) => {
      return { status: 'error', data: e.toString() } as BackendResponse;
    });
  }

  @OnMessage('[vmware-session]')
  @ReturnAck()
  vmwareNewSession(@ConnectedSocket() socket: Socket,
                   @SocketId() id: string,
                   @SocketSessionParam('userUuid') userUuid: string,
                   @SocketSessionParam('sessionId') sessionUuid: string,
                   @MessageBody() connectionData: { connectionUuid: string; workspaceUuid: string; }) {
    logger.info(`[Websocket vmware] -> newSession -> id [${id}], connectionUuid [${connectionData.connectionUuid}], workspaceUuid [${connectionData.workspaceUuid}]`);

    const VmwareModule: AnyOpsOSNodeVmwareModule = new AnyOpsOSNodeVmwareModule(userUuid, connectionData.workspaceUuid, connectionData.connectionUuid);

    return VmwareModule.newConnection().then((result: BackendResponse) => {
      return result;
    }).catch((e: Error) => {
      return { status: 'error', data: e.toString() } as BackendResponse;
    });
  }

}
