import routingControllers from 'routing-controllers';
import routingControllersSessionParam from 'routing-controllers/decorator/SessionParam';
import log4js, {Logger} from 'log4js';
import {Request, Response} from 'express';

//TODO ESM
const {Controller, Param, Get, Authorized, Put, BodyParam, Req, Res, Delete, Patch} = routingControllers;
const {getLogger} = log4js;
const {SessionParam} = routingControllersSessionParam;

import {AnyOpsOSApiGlobalsModule} from '@anyopsos/module-api-globals';
import {AnyOpsOSConfigFileModule, ConfigFile, ConfigFileData} from '@anyopsos/module-config-file';


const logger: Logger = getLogger('mainLog');

@Authorized()
@Controller('/api/config-file')
export class AnyOpsOSConfigFileApiController {

  @Get('/:workspaceUuid/:fileName/:configUuid?/:dataUuid?')
  async getConfigFile(@Req() request: Request,
                      @Res() response: Response,
                      @SessionParam('userUuid') userUuid: string,
                      @SessionParam('id') sessionUuid: string,
                      @Param('workspaceUuid') workspaceUuid: string,
                      @Param('fileName') fileName: string,
                      @Param('configUuid', { required: false }) configUuid?: string,
                      @Param('dataUuid', { required: false }) dataUuid?: string) {
    logger.info(`[API configFile] -> Get configFile -> workspaceUuid [${workspaceUuid}], fileName [${fileName}], configUuid [${configUuid}]`);

    const ConfigFileModule: AnyOpsOSConfigFileModule = new AnyOpsOSConfigFileModule(userUuid, workspaceUuid);
    const ApiGlobalsModule: AnyOpsOSApiGlobalsModule = new AnyOpsOSApiGlobalsModule(request, response);

    // @ts-ignore TODO
    const getResult: ConfigFile | ConfigFileData = await ConfigFileModule.get(fileName, configUuid, dataUuid);

    return ApiGlobalsModule.jsonDataResponse(getResult);
  }

  @Put('/:workspaceUuid/:fileName/:configUuid?/:dataUuid?')
  async putConfigFile(@Req() request: Request,
                      @Res() response: Response,
                      @SessionParam('userUuid') userUuid: string,
                      @SessionParam('id') sessionUuid: string,
                      @BodyParam('data') data: ConfigFileData,
                      @Param('workspaceUuid') workspaceUuid: string,
                      @Param('fileName') fileName: string,
                      @Param('configUuid', { required: false }) configUuid?: string,
                      @Param('dataUuid', { required: false }) dataUuid?: string) {
    logger.info(`[API configFile] -> Put configFile -> workspaceUuid [${workspaceUuid}], fileName [${fileName}], configUuid [${configUuid}]`);

    const ConfigFileModule: AnyOpsOSConfigFileModule = new AnyOpsOSConfigFileModule(userUuid, workspaceUuid);
    const ApiGlobalsModule: AnyOpsOSApiGlobalsModule = new AnyOpsOSApiGlobalsModule(request, response);

    // @ts-ignore TODO
    const putResult: ConfigFile | ConfigFileData = await ConfigFileModule.put(fileName, data, configUuid, dataUuid);

    return ApiGlobalsModule.jsonDataResponse(putResult);
  }

  @Patch('/:workspaceUuid/:fileName/:configUuid?/:dataUuid?')
  async patchConfigFile(@Req() request: Request,
                        @Res() response: Response,
                        @SessionParam('userUuid') userUuid: string,
                        @SessionParam('id') sessionUuid: string,
                        @BodyParam('data') data: ConfigFileData,
                        @Param('workspaceUuid') workspaceUuid: string,
                        @Param('fileName') fileName: string,
                        @Param('configUuid', { required: false }) configUuid?: string,
                        @Param('dataUuid', { required: false }) dataUuid?: string) {
    logger.info(`[API configFile] -> Patch configFile -> workspaceUuid [${workspaceUuid}], fileName [${fileName}], configUuid [${configUuid}]`);

    const ConfigFileModule: AnyOpsOSConfigFileModule = new AnyOpsOSConfigFileModule(userUuid, workspaceUuid);
    const ApiGlobalsModule: AnyOpsOSApiGlobalsModule = new AnyOpsOSApiGlobalsModule(request, response);

    // @ts-ignore TODO
    const patchResult: ConfigFile | { uuid: string; } = await ConfigFileModule.patch(fileName, data, configUuid, dataUuid);

    return ApiGlobalsModule.jsonDataResponse(patchResult);
  }

  @Delete('/:workspaceUuid/:fileName/:configUuid?/:dataUuid?')
  async deleteConfigFile(@Req() request: Request,
                         @Res() response: Response,
                         @SessionParam('userUuid') userUuid: string,
                         @SessionParam('id') sessionUuid: string,
                         @Param('workspaceUuid') workspaceUuid: string,
                         @Param('fileName') fileName: string,
                         @Param('configUuid', { required: false }) configUuid?: string,
                         @Param('dataUuid', { required: false }) dataUuid?: string) {
    logger.info(`[API configFile] -> Delete configFile -> workspaceUuid [${workspaceUuid}], fileName [${fileName}], configUuid [${configUuid}]`);

    const ConfigFileModule: AnyOpsOSConfigFileModule = new AnyOpsOSConfigFileModule(userUuid, workspaceUuid);
    const ApiGlobalsModule: AnyOpsOSApiGlobalsModule = new AnyOpsOSApiGlobalsModule(request, response);

    await ConfigFileModule.delete(fileName, configUuid, dataUuid);

    return ApiGlobalsModule.validResponse();
  }

}
