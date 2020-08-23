import {Injectable} from '@angular/core';

import {NGXLogger, CustomNGXLoggerService, NgxLoggerLevel} from 'ngx-logger';

import {AnyOpsOSLibUtilsService} from '@anyopsos/lib-utils';
import {MatSnackBar} from '@anyopsos/lib-angular-material';

@Injectable({
  providedIn: 'root'
})
export class AnyOpsOSLibLoggerService{
  private logger: NGXLogger;

  constructor(private readonly customLogger: CustomNGXLoggerService,
              private readonly snackBar: MatSnackBar,
              private readonly LibUtils: AnyOpsOSLibUtilsService) {

    this.logger = this.customLogger.create({ level: NgxLoggerLevel.TRACE });

  }

  trace(entry: string, message: string, args?: IArguments | string[], ...anything: any[]): void {
    this.logger.trace(`[${entry}] -> ${message} -> ${this.LibUtils.stringify(args)} -> ${anything}`);
  }

  debug(entry: string, message: string, args?: IArguments | string[], ...anything: any[]): void {
    this.logger.debug(`[${entry}] -> ${message} -> ${this.LibUtils.stringify(args)} -> ${anything}`);
  }

  info(entry: string, message: string, args?: IArguments | string[], ...anything: any[]): void {
    this.logger.info(`[${entry}] -> ${message} -> ${this.LibUtils.stringify(args)} -> ${anything}`);
  }

  log(entry: string, message: string, args?: IArguments | string[], ...anything: any[]): void {
    this.logger.log(`[${entry}] -> ${message} -> ${this.LibUtils.stringify(args)} -> ${anything}`);
    this.snackBar.open(message, entry, { panelClass: 'bg-success' });
  }

  warn(entry: string, message: string, args?: IArguments | string[], ...anything: any[]): void {
    this.logger.warn(`[${entry}] -> ${message} -> ${this.LibUtils.stringify(args)} -> ${anything}`);
    this.snackBar.open(message, entry, { panelClass: 'bg-warning' });
  }

  error(entry: string, message: string, args?: IArguments | string[], ...anything: any[]): void {
    this.logger.error(`[${entry}] -> ${message} -> ${this.LibUtils.stringify(args)} -> ${anything}`);
    this.snackBar.open(message, entry, { panelClass: 'bg-danger' });
  }

  fatal(entry: string, message: string, args?: IArguments | string[], ...anything: any[]): void {
    this.logger.fatal(`[${entry}] -> ${message} -> ${this.LibUtils.stringify(args)} -> ${anything}`);
    this.snackBar.open(message, entry, { panelClass: 'bg-danger' });
  }
}
