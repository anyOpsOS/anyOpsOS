import routingControllers, {ExpressMiddlewareInterface} from 'routing-controllers';
import {Request, Response, NextFunction} from 'express';
import log4js, {Logger} from 'log4js';

// TODO ESM
const {getLogger} = log4js;
const {Middleware} = routingControllers;

import {AnyOpsOSApiGlobalsModule} from '@anyopsos/module-api-globals';

const logger: Logger = getLogger('mainLog');

@Middleware({ type: 'after' })
export class AnyOpsOSApiFinalMiddleware implements ExpressMiddlewareInterface {

  public use(request: Request, response: Response, next?: NextFunction): void {

    if (!response.headersSent) {
      logger.info(`[API final middleware] 404 -> url [${request.originalUrl}]`);
      new AnyOpsOSApiGlobalsModule(request, response).notFound();
    }
  }

}
