import {Request, Response} from 'express';
import {EventEmitter} from 'events';
import routingControllers from 'routing-controllers';
import routingControllersSessionParam from 'routing-controllers/decorator/SessionParam';
import log4js, {Logger} from 'log4js';

// TODO ESM
const {Controller, Authorized, Req, Res, Param, BodyParam, Patch, Delete, Put, Get} = routingControllers;
const {SessionParam} = routingControllersSessionParam;
const {getLogger} = log4js;

import {AnyOpsOSApiGlobalsModule} from '@anyopsos/module-api-globals';
import {AnyOpsOSNodeNetappFileSystemModule} from '@anyopsos/module-node-netapp';


const logger: Logger = getLogger('mainLog');

// TODO
@Authorized()
@Controller('/api/netapp-file')
export class AnyOpsOSNetappFileApiController {

  @Get('/:workspaceUuid/:connectionUuid/:vfiler/:srcPath/:dstPath')
  async downloadFile(@Req() request: Request,
                     @Res() response: Response,
                     @SessionParam('userUuid') userUuid: string,
                     @SessionParam('id') sessionUuid: string,
                     @Param('workspaceUuid') workspaceUuid: string,
                     @Param('connectionUuid') connectionUuid: string,
                     @Param('vfiler') vfiler: string,
                     @Param('srcPath') srcPath: string,
                     @Param('dstPath') dstPath: string) {
    logger.info(`[API NetappFile] -> Download file -> workspaceUuid [${workspaceUuid}], connectionUuid [${connectionUuid}], srcPath [${srcPath}], dstPath [${dstPath}]`);

    const NetappFileSystemModule: AnyOpsOSNodeNetappFileSystemModule = new AnyOpsOSNodeNetappFileSystemModule(userUuid, workspaceUuid, connectionUuid);
    const ApiGlobalsModule: AnyOpsOSApiGlobalsModule = new AnyOpsOSApiGlobalsModule(request, response);

    const percentageEvent: EventEmitter = await NetappFileSystemModule.getFile(vfiler, srcPath, dstPath);

    percentageEvent
      .on('data', (percentage: number) => {
        return response.write(percentage);
      }).on('removeListener', () => {
        return ApiGlobalsModule.validResponse();
      });
  }

  @Put('/:workspaceUuid/:connectionUuid/:vfiler/:srcPath/:dstPath')
  async uploadFile(@Req() request: Request,
                   @Res() response: Response,
                   @SessionParam('userUuid') userUuid: string,
                   @SessionParam('id') sessionUuid: string,
                   @Param('workspaceUuid') workspaceUuid: string,
                   @Param('connectionUuid') connectionUuid: string,
                   @Param('vfiler') vfiler: string,
                   @Param('srcPath') srcPath: string,
                   @Param('dstPath') dstPath: string) {
    logger.info(`[API NetappFile] -> Upload file -> workspaceUuid [${workspaceUuid}], connectionUuid [${connectionUuid}], srcPath [${srcPath}], dstPath [${dstPath}]`);

    const NetappFileSystemModule: AnyOpsOSNodeNetappFileSystemModule = new AnyOpsOSNodeNetappFileSystemModule(userUuid, workspaceUuid, connectionUuid);
    const ApiGlobalsModule: AnyOpsOSApiGlobalsModule = new AnyOpsOSApiGlobalsModule(request, response);

    const percentageEvent: EventEmitter = await NetappFileSystemModule.putFile(vfiler, srcPath, dstPath);

    percentageEvent
      .on('data', (percentage: number) => {
        return response.write(percentage);
      }).on('removeListener', () => {
        return ApiGlobalsModule.validResponse();
      });
  }

  @Patch('/:workspaceUuid/:connectionUuid/:vfiler/:type/:fileName')
  async patchFile(@Req() request: Request,
                  @Res() response: Response,
                  @SessionParam('userUuid') userUuid: string,
                  @SessionParam('id') sessionUuid: string,
                  @Param('workspaceUuid') workspaceUuid: string,
                  @Param('connectionUuid') connectionUuid: string,
                  @Param('vfiler') vfiler: string,
                  @Param('type') type: 'copy' | 'move' | 'rename' | 'chmod' | 'chown',
                  @Param('srcPath') srcPath: string,
                  @BodyParam('dstPath', { required: false }) dstPath?: string,
                  @BodyParam('permissions', { required: false }) permissions?: string) {
    logger.info(`[API NetappFile] -> Rename/Move/Copy/Chown/Chmod file -> workspaceUuid [${workspaceUuid}], connectionUuid [${connectionUuid}], type [${type}], srcPath [${srcPath}], dstPath [${dstPath}], permissions [${permissions}]`);

    const NetappFileSystemModule: AnyOpsOSNodeNetappFileSystemModule = new AnyOpsOSNodeNetappFileSystemModule(userUuid, workspaceUuid, connectionUuid);
    const ApiGlobalsModule: AnyOpsOSApiGlobalsModule = new AnyOpsOSApiGlobalsModule(request, response);

    // 'dst' is required by 'copy' | 'move' | 'rename'
    // 'permissions' is required by 'chmod' | 'chown'
    if (typeof dstPath === 'undefined' && typeof permissions === 'undefined') {
      return ApiGlobalsModule.invalidResponse('dst_or_permissions_undefined');
    }

    if ((type === 'copy' || type === 'move' || type === 'rename') && dstPath) await NetappFileSystemModule.patchFile(vfiler, type, srcPath, dstPath);
    if ((type === 'chmod' || type === 'chown') && permissions) await NetappFileSystemModule.patchFilePermissions(vfiler, type, srcPath, permissions);

    return ApiGlobalsModule.validResponse();
  }

  @Delete('/:workspaceUuid/:connectionUuid/:vfiler/:srcPath')
  async deleteFile(@Req() request: Request,
                   @Res() response: Response,
                   @SessionParam('userUuid') userUuid: string,
                   @SessionParam('id') sessionUuid: string,
                   @Param('workspaceUuid') workspaceUuid: string,
                   @Param('connectionUuid') connectionUuid: string,
                   @Param('vfiler') vfiler: string,
                   @Param('srcPath') srcPath: string) {
    logger.info(`[API NetappFile] -> Delete file -> workspaceUuid [${workspaceUuid}], connectionUuid [${connectionUuid}], srcPath [${srcPath}]`);

    const NetappFileSystemModule: AnyOpsOSNodeNetappFileSystemModule = new AnyOpsOSNodeNetappFileSystemModule(userUuid, workspaceUuid, connectionUuid);
    const ApiGlobalsModule: AnyOpsOSApiGlobalsModule = new AnyOpsOSApiGlobalsModule(request, response);

    await NetappFileSystemModule.deleteFile(vfiler, srcPath);

    return ApiGlobalsModule.validResponse();
  }

}
