import routingControllers, { ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import log4js, { Logger } from 'log4js';

// TODO ESM
const { getLogger } = log4js;
const { Middleware } = routingControllers;

import { AnyOpsOSApiGlobalsModule } from '@anyopsos/module-api-globals';

const logger: Logger = getLogger('mainLog');

@Middleware({ type: 'after' })
export class AnyOpsOSApiErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {

  public error(e: any, request: Request, response: Response, next?: NextFunction): void {

    if (!response.headersSent) {
      logger.info(`[API error-handler middleware] ${e.httpCode ? e.httpCode : 500} -> method [${request.method}], url [${request.originalUrl}] -> ${e}`);
      new AnyOpsOSApiGlobalsModule(request, response).serverError(e);
    }
  }

}
