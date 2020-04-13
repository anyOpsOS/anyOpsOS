import {Request, Response} from 'express';
import routingControllers from 'routing-controllers';
import routingControllersSessionParam from 'routing-controllers/decorator/SessionParam';
import log4js, {Logger} from 'log4js';

// TODO ESM
const {Controller, Authorized, Req, Res, BodyParam, Post, Param} = routingControllers;
const {SessionParam} = routingControllersSessionParam;
const {getLogger} = log4js;

import {AnyOpsOSApiGlobalsModule} from '@anyopsos/module-api-globals';
import {AnyOpsOSNodeNetappModule} from '@anyopsos/module-node-netapp';
import {NetappSdkFunctions, NetappSdkVfilerFunctions, NetappSdkFunctionsInput, NetappSdkVfilerFunctionsInput} from '@anyopsos/sdk-netapp';
import {BackendResponse} from '@anyopsos/backend-core/app/types/backend-response';


const logger: Logger = getLogger('mainLog');

@Authorized()
@Controller('/api/netapp')
export class AnyOpsOSNetappApiController {

  /**
   * Node APIs
   */
  @Post('/soap/:workspaceUuid/:connectionUuid/:vfiler?')
  async netappCallSoap(@Req() request: Request,
                       @Res() response: Response,
                       @SessionParam('userUuid') userUuid: string,
                       @SessionParam('id') sessionUuid: string,
                       @BodyParam('action') action: NetappSdkFunctions | NetappSdkVfilerFunctions,
                       @BodyParam('data') data: NetappSdkFunctionsInput<any> | NetappSdkVfilerFunctionsInput<any>,
                       @Param('workspaceUuid') workspaceUuid: string,
                       @Param('connectionUuid') connectionUuid: string,
                       @Param('vfiler', { required: false }) vfiler?: string) {
    logger.info(`[API NetApp] -> Call -> workspaceUuid [${workspaceUuid}], connectionUuid [${connectionUuid}]`);

    const NetappModule: AnyOpsOSNodeNetappModule = new AnyOpsOSNodeNetappModule(userUuid, workspaceUuid, connectionUuid);
    const ApiGlobalsModule: AnyOpsOSApiGlobalsModule = new AnyOpsOSApiGlobalsModule(request, response);

    let soapResult: BackendResponse;

    if (vfiler) {
      soapResult = await NetappModule.callSoapApi(action as NetappSdkVfilerFunctions, data, vfiler);
    } else {
      soapResult = await NetappModule.callSoapApi(action as NetappSdkFunctions, data);
    }


    return ApiGlobalsModule.jsonDataResponse(soapResult);
  }

}
