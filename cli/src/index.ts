import chalk from 'chalk';
import yargs from 'yargs';

// TODO ESM
const {blueBright, green} = chalk

import {Builders} from './commands/builders.js';
import {Linters} from './commands/linters.js';
import {Generators} from './commands/generators.js';
import {Docker} from './commands/docker.js';
import {swagger} from './swagger-generator/index.js';
import {Types} from './types/types.js';
import {runInDocker} from './utils.js';

export class anyOpsOS {

  constructor() {
  }

  runCli(): void {
    // tslint:disable-next-line:no-unused-expression
    yargs
      .usage(green('Usage: $0 <command> [options]'))
      .command({
        command: 'init',
        describe: `Initialize development environment automatically`,
        handler: async () => {
          try {

            await new Docker().prepare({force: true});
            await new Docker().download();
            await new Docker().certificate();
            await new Docker().k8s();
            await new Docker().build();

            await new Docker().install();
            await new Builders().buildCli();

            if (process.env.RUNINDOCKER !== 'true') {
              return runInDocker(`node .dist/cli/bin/anyopsos.js build all`);
            } else {
              return new Builders().buildAll();
            }

          } catch (err) {
            console.error(err);
            process.exit(1);
          }
        }
      })
      .command({
        command: 'docker <action> [force]',
        describe: `Interacts with the Development Docker container

    <action> is on of:

    Basic operations:
    * <prepare>: Launches a Docker container with anyOpsOS files mounted on /var/www
    * <attach>: Attach to the container Shell
    * <logs>: Stream all anyopsos k8s container logs

    Code Development:
    * <download>: Performs a 'git clone' of anyOpsOS repository
    * <install>: Performs a 'yarn install' inside the container
    * <build>: Build the required Docker images for use with <k8s>

    Environment:
    * <certificate>: Generates all required certificates used for Pod to Pod communication
    * <k8s>: It will apply the required yaml configuration files to you Kubernetes


    > any command will perform a 'prepare' action first if required
    > [--force] recreates the Docker Image & Container even if already exist
        `,
        builder: {
          action: {
            demand: false,
            describe: 'specify module type',
            hidden: true,
            choices: ['prepare', 'attach', 'download', 'install', 'build', 'certificate', 'k8s', 'logs']
          }
        },
        handler: async (args: { force: any; action: string; }) => {
          try {

            if (args.action === 'prepare') return await new Docker().prepare(args);
            if (args.action === 'attach') return await new Docker().attach();
            if (args.action === 'download') return await new Docker().download();
            if (args.action === 'install') return await new Docker().install();
            if (args.action === 'build') return await new Docker().build();
            if (args.action === 'certificate') return await new Docker().certificate();
            if (args.action === 'k8s') return await new Docker().k8s();
            if (args.action === 'logs') return await new Docker().logs();

          } catch (err) {
            console.error(err);
            process.exit(1);
          }
        }
      })
      .command({
        command: blueBright('basic code architecture information'),
        describe: `${blueBright('List of module <type>s:')}
      ----
      Frontend:
      * <frontend>: The Frontend
      * <library>: /projects/libraries/*
      * <external-library>: /projects/external-libraries/*
      * <application>: /projects/applications/*
      * <modal>: /projects/modals/*

      Backend:
      * <backend>: All backends (auth, fileSystem, core)
      * <module>: /projects/modules/*
      * <api-middleware>: /projects/api-middlewares/*
      * <api>: /projects/apis/*
      * <websocket>: /projects/websockets/*

      * a type <all> will refers to every module type

      > [moduleName] refers to a specific module <type> by its name. Not compatible with <frontend>, <backend> & <all>
      ----
      `,
        handler: async () => {
        }
      })
      .command({
        command: 'new <type> <name> [prefix]',
        describe: `Creates a new anyOpsOS module of defined type

      Only these types are available:
      * library [prefix]
      * external-library [prefix]
      * application [prefix]
      * modal [prefix]

      * api
      * module
      * websocket
      `,
        builder: {
          type: {
            demand: true,
            describe: 'specify module type',
            hidden: true,
            choices: ['library', 'external-library', 'application', 'modal', 'api', 'module', 'websocket']
          }
        },
        handler: async (argv: & { type: Types; name: string; prefix: string; }) => {
          try {
            await new Generators().createModule(argv);

          } catch (err) {
            console.error(err);
            process.exit(1);
          }
        }
      })
      .command({
        command: 'lint <type> [moduleName]',
        describe: 'Lints an anyOpsOS module type',
        builder: {
          type: {
            demand: true,
            describe: 'specify module type',
            hidden: true,
            choices: ['all', 'backend', 'frontend', 'library', 'external-library', 'application', 'modal', 'module', 'api-middleware', 'api', 'websocket']
          }
        },
        handler: async (argv: & { type: Types; moduleName?: string }) => {
          try {
            // Run lint commands inside container
            if (process.env.RUNINDOCKER !== 'true') return runInDocker(`node .dist/cli/bin/anyopsos.js lint ${argv.type} ${argv.moduleName || ''}`);

            if (argv.type === 'all') return await new Linters().lintAll();
            if (argv.type === 'module') return await new Linters().lintBackendTypes(argv);
            if (argv.type === 'api-middleware') return await new Linters().lintBackendTypes(argv);
            if (argv.type === 'api') return await new Linters().lintBackendTypes(argv);
            if (argv.type === 'websocket') return await new Linters().lintBackendTypes(argv);
            if (argv.type === 'backend') return await new Linters().lintBackend();
            if (argv.type === 'frontend') return await new Linters().lintFrontend();
            if (argv.type === 'library') return await new Linters().lintFrontendTypes(argv);
            if (argv.type === 'external-library') return await new Linters().lintFrontendTypes(argv);
            if (argv.type === 'application') return await new Linters().lintFrontendTypes(argv);
            if (argv.type === 'modal') return await new Linters().lintFrontendTypes(argv);

          } catch (err) {
            console.error(err);
            process.exit(1);
          }
        }
      })
      .command({
        command: 'build <type> [moduleName]',
        describe: 'Builds an anyOpsOS module type',
        builder: {
          type: {
            demand: true,
            describe: 'specify module type',
            hidden: true,
            choices: ['all', 'backend', 'frontend', 'library', 'external-library', 'application', 'modal', 'module', 'api-middleware', 'api', 'websocket', 'cli']
          }
        },
        handler: async (argv: & { type: Types; moduleName?: string }) => {
          try {
            // Run build commands inside container
            console.log(`node .dist/cli/bin/anyopsos.js build ${argv.type} ${argv.moduleName || ''}`);
            if (process.env.RUNINDOCKER !== 'true' && argv.type !== 'cli') return runInDocker(`node .dist/cli/bin/anyopsos.js build ${argv.type} ${argv.moduleName || ''}`);

            if (argv.type === 'all') return new Builders().buildAll();
            if (argv.type === 'module') return new Builders().buildBackendTypes(argv);
            if (argv.type === 'api-middleware') return new Builders().buildBackendTypes(argv);
            if (argv.type === 'api') return new Builders().buildBackendTypes(argv).then(async () => await new swagger().createSwaggerFiles());
            if (argv.type === 'websocket') return new Builders().buildBackendTypes(argv);
            if (argv.type === 'backend') return new Builders().buildBackend();
            if (argv.type === 'frontend') return new Builders().buildFrontend();
            if (argv.type === 'library') return new Builders().buildFrontendTypes(argv);
            if (argv.type === 'external-library') return new Builders().buildFrontendTypes(argv);
            if (argv.type === 'application') return new Builders().buildFrontendTypes(argv);
            if (argv.type === 'modal') return new Builders().buildFrontendTypes(argv);
            if (argv.type === 'cli') return new Builders().buildCli();
          } catch (err) {
            console.trace(err);
            process.exit(1);
          }
        }
      })
      .updateStrings({
        'Options:': blueBright('Options:'),
        'Commands:': blueBright('Commands:')
      })
      .example('$0 new modal file-system fs', 'Will create a new modal with prefix \'amfs\'')
      .help()
      .strict()
      .showHelpOnFail(true)
      .demandCommand(1, '')
      .epilogue(`For more information, see https://github.com/anyopsos/anyopsos`)
      .wrap(yargs.terminalWidth())
      .argv;
  }

}
