import socketControllers from 'socket-controllers';
import { Socket } from 'socket.io';
import log4js, { Logger } from 'log4js';

// TODO ESM
const { getLogger } = log4js;
const { SocketController, SocketId, OnConnect, OnDisconnect, ConnectedSocket } = socketControllers;

import { AnyOpsOSSysWorkspaceModule, Workspace } from '@anyopsos/module-sys-workspace';


const logger: Logger = getLogger('mainLog');

@SocketController()
export class AnyOpsOSMainWebsocketController {

  @OnConnect()
  async connection(@SocketId() id: string,
                   @ConnectedSocket() socket: Socket) {
    logger.info(`[Socket] -> Connected id [${id}]`);

    socket.join(socket.client.request.session.sessionId);
    socket.join('user-' + socket.client.request.session.userUuid);

    const WorkspaceModule: AnyOpsOSSysWorkspaceModule = new AnyOpsOSSysWorkspaceModule(socket.client.request.session.userUuid);
    const defaultWorkspace: Workspace = await WorkspaceModule.getDefaultWorkspace();

    socket.join(defaultWorkspace.workspaceUuid);
  }

  @OnDisconnect()
  disconnect(@SocketId() id: string) {
    logger.warn(`[Socket] -> Disconnect id [${id}]`);
  }

  // TODO socket on error?

}
