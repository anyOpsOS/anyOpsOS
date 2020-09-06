import { Request, Response } from 'express';
import routingControllers from 'routing-controllers';
import routingControllersSessionParam from 'routing-controllers/decorator/SessionParam';
import log4js, { Logger } from 'log4js';

// TODO ESM
const { Controller, Get, Put, Authorized, Req, Res, BodyParam, Delete, Param, Patch } = routingControllers;
const { SessionParam } = routingControllersSessionParam
const { getLogger } = log4js;

import { AnyOpsOSApiGlobalsModule } from '@anyopsos/module-api-globals';
import { AnyOpsOSCredentialModule, Credential } from '@anyopsos/module-credential';


const logger: Logger = getLogger('mainLog');

@Authorized()
@Controller('/api/credential')
export class AnyOpsOSCredentialApiController {

  @Get('/:workspaceUuid')
  async getAllCredentials(@Req() request: Request,
                          @Res() response: Response,
                          @SessionParam('userUuid') userUuid: string,
                          @SessionParam('id') sessionUuid: string,
                          @Param('workspaceUuid') workspaceUuid: string) {
    logger.info(`[API Credentials] -> Get credentials -> workspaceUuid [${workspaceUuid}]`);

    const CredentialModule: AnyOpsOSCredentialModule = new AnyOpsOSCredentialModule(userUuid, workspaceUuid);
    const ApiGlobalsModule: AnyOpsOSApiGlobalsModule = new AnyOpsOSApiGlobalsModule(request, response);

    const credentials: Omit<Credential, 'password'>[] = await CredentialModule.getCredentials();

    return ApiGlobalsModule.jsonDataResponse(credentials);
  }

  // TODO ALLOW THIS API ONLY FROM INTERNAL SOURCES, NOT FROM THE USERS
  @Get('/:workspaceUuid/:credentialUuid')
  async getAllCredential(@Req() request: Request,
                         @Res() response: Response,
                         @SessionParam('userUuid') userUuid: string,
                         @SessionParam('id') sessionUuid: string,
                         @Param('workspaceUuid') workspaceUuid: string,
                         @Param('credentialUuid') credentialUuid: string) {
    logger.info(`[API Credentials] -> Get credential -> workspaceUuid [${workspaceUuid}], credentialUuid [${credentialUuid}]`);

    const CredentialModule: AnyOpsOSCredentialModule = new AnyOpsOSCredentialModule(userUuid, workspaceUuid);
    const ApiGlobalsModule: AnyOpsOSApiGlobalsModule = new AnyOpsOSApiGlobalsModule(request, response);

    const credentials: Credential = await CredentialModule.getCredential(credentialUuid);

    return ApiGlobalsModule.jsonDataResponse(credentials);
  }

  @Put('/:workspaceUuid')
  async putCredential(@Req() request: Request,
                      @Res() response: Response,
                      @SessionParam('userUuid') userUuid: string,
                      @SessionParam('id') sessionUuid: string,
                      @BodyParam('credential') credential: Omit<Credential, 'uuid'>,
                      @Param('workspaceUuid') workspaceUuid: string) {
    logger.info(`[API Credentials] -> Put credential -> workspaceUuid [${workspaceUuid}]`);

    const CredentialModule: AnyOpsOSCredentialModule = new AnyOpsOSCredentialModule(userUuid, workspaceUuid);
    const ApiGlobalsModule: AnyOpsOSApiGlobalsModule = new AnyOpsOSApiGlobalsModule(request, response);

    const credentialUuid: string = await CredentialModule.putCredential(credential);

    return ApiGlobalsModule.jsonDataResponse({
      uuid: credentialUuid
    });
  }

  @Patch('/:workspaceUuid/:credentialUuid')
  async patchCredential(@Req() request: Request,
                        @Res() response: Response,
                        @SessionParam('userUuid') userUuid: string,
                        @SessionParam('id') sessionUuid: string,
                        @BodyParam('credential') credential: Partial<Credential>,
                        @Param('workspaceUuid') workspaceUuid: string,
                        @Param('credentialUuid') credentialUuid: string) {
    logger.info(`[API Credentials] -> Patch credential -> workspaceUuid [${workspaceUuid}], credentialUuid [${credentialUuid}]`);

    if (!credential.uuid) throw new Error('resource_not_found');

    const CredentialModule: AnyOpsOSCredentialModule = new AnyOpsOSCredentialModule(userUuid, workspaceUuid);
    const ApiGlobalsModule: AnyOpsOSApiGlobalsModule = new AnyOpsOSApiGlobalsModule(request, response);

    await CredentialModule.patchCredential(credentialUuid, credential);

    return ApiGlobalsModule.jsonDataResponse({
      uuid: credentialUuid
    });
  }

  @Delete('/:workspaceUuid/:credentialUuid')
  async deleteCredential(@Req() request: Request,
                         @Res() response: Response,
                         @SessionParam('userUuid') userUuid: string,
                         @SessionParam('id') sessionUuid: string,
                         @Param('credentialUuid') credentialUuid: string,
                         @Param('workspaceUuid') workspaceUuid: string) {
    logger.info(`[API Credentials] -> Delete credentials -> workspaceUuid [${workspaceUuid}], credentialUuid [${credentialUuid}]`);

    const CredentialModule: AnyOpsOSCredentialModule = new AnyOpsOSCredentialModule(userUuid, workspaceUuid);
    const ApiGlobalsModule: AnyOpsOSApiGlobalsModule = new AnyOpsOSApiGlobalsModule(request, response);

    await CredentialModule.deleteCredential(credentialUuid);

    return ApiGlobalsModule.jsonDataResponse({
      uuid: credentialUuid
    });
  }

}
