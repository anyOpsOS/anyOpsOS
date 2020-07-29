import routingControllers from 'routing-controllers';
import routingControllersSessionParam from 'routing-controllers/decorator/SessionParam';
import {Request, Response} from 'express';
import log4js, {Logger} from 'log4js';

// TODO ESM
const {Controller, Get, Authorized, Req, Res, Param, QueryParam} = routingControllers;
const {SessionParam} = routingControllersSessionParam;
const {getLogger} = log4js;

import {AnyOpsOSApiGlobalsModule} from '@anyopsos/module-api-globals';
import {AnyOpsOSSysWorkspaceModule} from '@anyopsos/module-sys-workspace';
import {Workspace} from '@anyopsos/module-sys-workspace/src/lib/types/workspace';


const logger: Logger = getLogger('mainLog');

@Authorized()
@Controller('/api/workspace')
export class AnyOpsOSWorkspaceApiController {

  @Get("/:workspaceUuid?")
  async getWorkspace(@Req() request: Request,
                     @Res() response: Response,
                     @SessionParam('userUuid') userUuid: string,
                     @Param('workspaceUuid', { required: false }) workspaceUuid?: string,
                     @QueryParam('onlyDefault', { required: false }) onlyDefault?: boolean) {
    logger.info(`[API workspace] -> getWorkspace`);

    const WorkspaceModule: AnyOpsOSSysWorkspaceModule = new AnyOpsOSSysWorkspaceModule(userUuid);
    const ApiGlobalsModule: AnyOpsOSApiGlobalsModule = new AnyOpsOSApiGlobalsModule(request, response);

    // Return detailed information of specific workspace for this user
    if (workspaceUuid) {
      const workspace: Workspace = await WorkspaceModule.getWorkspaceByUuid(workspaceUuid);
      return ApiGlobalsModule.jsonDataResponse(workspace);
    }

    // Return the uuid of default workspace for this user
    if (onlyDefault) {
      const defaultWorkspace: Workspace = await WorkspaceModule.getDefaultWorkspace();
      return ApiGlobalsModule.jsonDataResponse(defaultWorkspace);
    }

    // Return detailed information of all workspaces for this user
    const workspaces: Workspace[] = await WorkspaceModule.getWorkspacesDetails();
    return ApiGlobalsModule.jsonDataResponse(workspaces);
  }

}
