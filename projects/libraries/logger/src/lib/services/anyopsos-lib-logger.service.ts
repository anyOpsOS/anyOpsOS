import {Injectable} from '@angular/core';

import {NGXLogger, CustomNGXLoggerService, NGXMapperService, NgxLoggerLevel, NGXLoggerUtils, NGXLogInterface} from 'ngx-logger';

import {AnyOpsOSLibUtilsService} from '@anyopsos/lib-utils';
import {MatSnackBar} from '@anyopsos/lib-angular-material';

const Levels = [
  'TRACE',
  'DEBUG',
  'INFO',
  'LOG',
  'WARN',
  'ERROR',
  'FATAL',
  'OFF'
];

@Injectable({
  providedIn: 'root'
})
export class AnyOpsOSLibLoggerService{
  private logger: NGXLogger;

  constructor(private readonly customLogger: CustomNGXLoggerService,
              private readonly mapperService: NGXMapperService,
              private readonly snackBar: MatSnackBar,
              private readonly LibUtils: AnyOpsOSLibUtilsService) {

    this.logger = this.customLogger.create({ level: NgxLoggerLevel.TRACE });

  }

  trace(entry: string, message: string, args?: IArguments | string[], ...anything: any[]): void {
    // this.logger.trace(`[${entry}] -> ${message} -> ${this.LibUtils.stringify(args)} -> ${anything}`);
    this._log(NgxLoggerLevel.TRACE, `[${entry}] -> ${message} -> ${this.LibUtils.stringify(args)} -> ${this.LibUtils.stringify(anything)}`);
  }

  debug(entry: string, message: string, args?: IArguments | string[], ...anything: any[]): void {
    // this.logger.debug(`[${entry}] -> ${message} -> ${this.LibUtils.stringify(args)} -> ${anything}`);
    this._log(NgxLoggerLevel.DEBUG, `[${entry}] -> ${message} -> ${this.LibUtils.stringify(args)} -> ${this.LibUtils.stringify(anything)}`);
  }

  info(entry: string, message: string, args?: IArguments | string[], ...anything: any[]): void {
    // this.logger.info(`[${entry}] -> ${message} -> ${this.LibUtils.stringify(args)} -> ${anything}`);
    this._log(NgxLoggerLevel.INFO, `[${entry}] -> ${message} -> ${this.LibUtils.stringify(args)} -> ${this.LibUtils.stringify(anything)}`);
  }

  log(entry: string, message: string, args?: IArguments | string[], ...anything: any[]): void {
    // this.logger.log(`[${entry}] -> ${message} -> ${this.LibUtils.stringify(args)} -> ${anything}`);
    this._log(NgxLoggerLevel.LOG, `[${entry}] -> ${message} -> ${this.LibUtils.stringify(args)} -> ${this.LibUtils.stringify(anything)}`);
    this.snackBar.open(message, entry, { panelClass: 'bg-success' });
  }

  warn(entry: string, message: string, args?: IArguments | string[], ...anything: any[]): void {
    // this.logger.warn(`[${entry}] -> ${message} -> ${this.LibUtils.stringify(args)} -> ${anything}`);
    this._log(NgxLoggerLevel.WARN, `[${entry}] -> ${message} -> ${this.LibUtils.stringify(args)} -> ${this.LibUtils.stringify(anything)}`);
    this.snackBar.open(message, entry, { panelClass: 'bg-warning' });
  }

  error(entry: string, message: string, args?: IArguments | string[], ...anything: any[]): void {
    // this.logger.error(`[${entry}] -> ${message} -> ${this.LibUtils.stringify(args)} -> ${anything}`);
    this._log(NgxLoggerLevel.ERROR, `[${entry}] -> ${message} -> ${this.LibUtils.stringify(args)} -> ${this.LibUtils.stringify(anything)}`);
    this.snackBar.open(message, entry, { panelClass: 'bg-danger' });
  }

  fatal(entry: string, message: string, args?: IArguments | string[], ...anything: any[]): void {
    // this.logger.fatal(`[${entry}] -> ${message} -> ${this.LibUtils.stringify(args)} -> ${anything}`);
    this._log(NgxLoggerLevel.FATAL, `[${entry}] -> ${message} -> ${this.LibUtils.stringify(args)} -> ${this.LibUtils.stringify(anything)}`);
    this.snackBar.open(message, entry, { panelClass: 'bg-danger' });
  }

  private _log(level: NgxLoggerLevel, message, additional: any[] = []): void {
    const config = {
      level: NgxLoggerLevel.TRACE,
      enableSourceMaps: true
    };

    const isLogLevelEnabled = level >= config.level;

    if (!(message && isLogLevelEnabled)) {
      return;
    }

    const logLevelString = Levels[level];

    message = typeof message === 'function' ? message() : message;
    message = NGXLoggerUtils.prepareMessage(message);

    const timestamp = new Date().toISOString();

    // const callerDetails = NGXLoggerUtils.getCallerDetails();
    this.mapperService.getCallerDetails(config.enableSourceMaps).subscribe((callerDetails: {
      fileName: string;
      lineNumber: number;
      columnNumber: number;
    }) => {

      // if no message or the log level is less than the environ
      if (isLogLevelEnabled) {

        // TODO hardcoded replace string
        const metaString = NGXLoggerUtils.prepareMetaString(timestamp, logLevelString,
          callerDetails.fileName.replace('../../../../projects/', ''), callerDetails.lineNumber.toString());

        return this._logModern(level, metaString, message, additional);
      }
    });
  }

  private _logModern(level: NgxLoggerLevel, metaString: string, message: string, additional: any[]): void {
    const configuredColors = ['#800080', '#008080', '#808080', '#808080', '#FF0000', '#FF0000', '#FF0000'];
    const color = NGXLoggerUtils.getColor(level, configuredColors);

    // make sure additional isn't null or undefined so that ...additional doesn't error
    additional = additional || [];

    switch (level) {
      case NgxLoggerLevel.WARN:
        console.warn(`%c${metaString}`, `color:${color}`, message, ...additional);
        break;
      case NgxLoggerLevel.ERROR:
      case NgxLoggerLevel.FATAL:
        console.error(`%c${metaString}`, `color:${color}`, message, ...additional);
        break;
      case NgxLoggerLevel.INFO:
        console.info(`%c${metaString}`, `color:${color}`, message, ...additional);
        break;
      //  Disabling console.trace since the stack trace is not helpful. it is showing the stack trace of
      // the console.trace statement
      // case NgxLoggerLevel.TRACE:
      //   console.trace(`%c${metaString}`, `color:${color}`, message, ...additional);
      //   break;

      //  Disabling console.debug, because Has this hidden by default.
      // case NgxLoggerLevel.DEBUG:
      //   console.debug(`%c${metaString}`, `color:${color}`, message, ...additional);
      //   break;
      default:
        console.log(`%c${metaString}`, `color:${color}`, message, ...additional);
    }
  }
}
