import log4js, {Logger} from 'log4js';

// TODO ESM
const {configure, getLogger} = log4js;

const logger: Logger = getLogger('mainLog');

export class Init {

  constructor() {
    configure({
      appenders: {
        console: {type: 'console', level: 'trace'}
      },
      categories: {
        default: {appenders: ['console'], level: 'trace'},
        mainLog: {appenders: ['console'], level: 'trace'}
      }
    });
  }

  /**
   * Checks and creates if required all Credentials databases
   */
  private async nodeConnect(): Promise<void> {

  }

  /**
   * Main function that launch all system checks
   */
  public async initialize(): Promise<void> {
    return Promise.all([
      this.nodeConnect()
    ]).then(() => {}).catch((e) => {
      console.log(e);
    });
  }
}
