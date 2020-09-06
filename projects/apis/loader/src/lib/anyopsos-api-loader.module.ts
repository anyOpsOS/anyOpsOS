import { Stats } from 'fs';
import { join } from 'path';
import { Request, Response } from 'express';
import routingControllers from 'routing-controllers';
import log4js, { Logger } from 'log4js';
import fs from 'fs-extra';

// TODO ESM
const { Controller, Get, Req, Res, Param } = routingControllers;
const { getLogger } = log4js;
const { pathExistsSync, stat } = fs;

import { AnyOpsOSSysGetPathModule } from '@anyopsos/module-sys-get-path';


const logger: Logger = getLogger('mainLog');

@Controller('/api/loader')
export class AnyOpsOSFileApiController {

  // TODO not using file-system module
  @Get('/:srcPath(*)')
  async getFile(@Req() request: Request,
                @Res() response: Response,
                @Param('srcPath') srcPath: string) {
    logger.info(`[API Loader] -> Get file -> srcPath [${srcPath}]`);

    const GetPathModule: AnyOpsOSSysGetPathModule = new AnyOpsOSSysGetPathModule();

    if (srcPath.indexOf('\0') !== -1) throw new Error('param_security_stop');

    const realSrcPath: string = join(GetPathModule.filesystem, srcPath);
    if (!pathExistsSync(realSrcPath)) throw new Error('resource_not_found');

    const fileStats: Stats = await stat(realSrcPath);
    if (fileStats.isDirectory()) throw new Error('resource_invalid');

    const options = {
      root: GetPathModule.filesystem,
      dotfiles: 'allow',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    };

    try {
      await new Promise((resolve, reject) => {

        response.sendFile(srcPath, options, (e: Error) => {
          if (e) reject(e);
          resolve();
        });

      });
    } catch (e) {
      throw new Error(e);
    }

    return;
  }

}
