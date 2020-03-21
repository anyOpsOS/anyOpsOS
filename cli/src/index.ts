import * as yargs from 'yargs';
import {blue, blueBright, green, red} from 'chalk';
import awaitSpawn from 'await-spawn';
import {ensureFile} from 'fs-extra';

import {Builders} from './commands/builders';
import {Linters} from './commands/linters';
import {Generators} from './commands/generators';
import {INTERNAL_PATH_CWD, MAIN_PATH_CWD} from './constants';
import {Types} from './types/types';
import {runInDocker} from './utils';

export class anyOpsOS {

  constructor() {
  }

  runCli(): void {
    // tslint:disable-next-line:no-unused-expression
    yargs
      .usage(green('Usage: $0 <command> [options]'))
      .command({
        command: 'docker <action> [force]',
        describe: `Interacts with the Development Docker container

    <action> is on of:

    Basic operations:
    * <prepare>: Launches a Docker container with anyOpsOS files mounted on /var/www
    * <attach>: Attach to the container Shell

    Code Development:
    * <download>: Performs a 'get clone' of anyOpsOS repository
    * <install>: Performs a 'yarn install' inside the container

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
            choices: ['prepare', 'attach', 'download', 'install', 'certificate', 'k8s']
          }
        },
        handler: async (args) => {
          try {

            if (args.action === 'attach') return runInDocker('bash');
            if (args.action === 'install') return runInDocker('yarn install');
            if (args.action === 'download') return runInDocker('git clone https://github.com/anyOpsOS/anyOpsOS .');
            if (args.action === 'prepare') {
              if (args.force) console.log(red(`[anyOpsOS Cli. Internals] Force recreation of Docker Development Image and Container.`));

              // Check if devel container is already created
              const dockerContainers: string = await awaitSpawn('docker', ['ps', '-a', '--format=\'{{json .Names}}\''], {
                cwd: MAIN_PATH_CWD
              });

              const containerExists = dockerContainers.toString().includes('"anyopsos-devel"');

              if (containerExists) {

                // Stop here
                if (!args.force) return console.log(blueBright(`[anyOpsOS Cli. Internals] Docker Development container already exists.`));

                await awaitSpawn('docker', ['rm', '--force', 'anyopsos-devel'], {
                  cwd: MAIN_PATH_CWD
                });

              }

              // Check if devel image is already created
              const dockerImages: string = await awaitSpawn('docker', ['images', '--format=\'{{json .Repository}}\''], {
                cwd: MAIN_PATH_CWD
              });

              const imageExists = dockerImages.toString().includes('"anyopsos-devel"');

              // Create image
              if (!imageExists || args.force) {

                console.log(blueBright(`[anyOpsOS Cli. Internals] Creating Docker Development Image.`));

                // Build devel image
                await awaitSpawn('docker', ['build', '-f', 'docker/Dockerfile.devel', '-t', 'anyopsos-devel', './docker'], {
                  cwd: MAIN_PATH_CWD,
                  stdio: 'inherit'
                });
              }

              // Check if volume is already created
              const dockerVolumes: string = await awaitSpawn('docker', ['volume', 'ls', '--format=\'{{json .Name}}\''], {
                cwd: MAIN_PATH_CWD
              });

              const volumeExists = dockerVolumes.toString().includes('"anyopsos-data"');

              // Create image
              if (!volumeExists || args.force) {

                console.log(blueBright(`[anyOpsOS Cli. Internals] Creating Docker Development Volume.`));

                // Create data volume
                await awaitSpawn('docker', ['volume', 'create', 'anyopsos-data'], {
                  cwd: MAIN_PATH_CWD,
                  stdio: 'inherit'
                });
              }

              console.log(blueBright(`[anyOpsOS Cli. Internals] Creating Docker Development container.`));

              await ensureFile('ssh.key');

              // Run container
              await awaitSpawn('docker', [
                'run',
                '--rm',
                '-d',
                '-p', '2222:22',
                '--mount', `src=anyopsos-data,target=${INTERNAL_PATH_CWD},type=volume`,
                '--mount', `src=${MAIN_PATH_CWD}/ssh.key,target=/root/id_rsa,type=bind,consistency=delegated`,
                '--name', 'anyopsos-devel',
                'anyopsos-devel'
              ], {
                cwd: MAIN_PATH_CWD,
                stdio: 'inherit'
              });

              console.log(red(`[anyOpsOS Cli.] SSH key file [ssh.key] generated. Use this key to manage the container files from your IDE.`));
            }

          } catch (err) {
            console.error(err);
            process.exit(1);
          }
        }
      })
      .command({
        command: blue('basic code architecture information'),
        describe: `${blue('List of module <type>s:')}
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
            choices: ['all', 'backend', 'frontend', 'library', 'external-library', 'application', 'modal', 'module', 'api-middleware', 'api', 'websocket']
          }
        },
        handler: async (argv: & { type: Types; moduleName?: string }) => {
          try {
            if (argv.type === 'all') return await new Builders().buildAll();
            if (argv.type === 'module') return await new Builders().buildBackendTypes(argv);
            if (argv.type === 'api-middleware') return await new Builders().buildBackendTypes(argv);
            if (argv.type === 'api') return await new Builders().buildBackendTypes(argv).then(async () => await require('./swagger-generator/index'));
            if (argv.type === 'websocket') return await new Builders().buildBackendTypes(argv);
            if (argv.type === 'backend') return await new Builders().buildBackend();
            if (argv.type === 'frontend') return await new Builders().buildFrontend();
            if (argv.type === 'library') return await new Builders().buildFrontendTypes(argv);
            if (argv.type === 'external-library') return await new Builders().buildFrontendTypes(argv);
            if (argv.type === 'application') return await new Builders().buildFrontendTypes(argv);
            if (argv.type === 'modal') return await new Builders().buildFrontendTypes(argv);
          } catch (err) {
            console.error(err);
            process.exit(1);
          }
        }
      })
      .updateStrings({
        'Options:': blue('Options:'),
        'Commands:': blue('Commands:')
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
