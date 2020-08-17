import chalk from 'chalk';
import chokidar from 'chokidar';
import fs from 'fs-extra';

const {readdir} = fs;

// TODO ESM
const {blueBright, red, green} = chalk

import {runInDocker} from '../utils.js';
import {INTERNAL_PATH_CWD} from '../constants.js';

export class Watcher {

  constructor() {
  }

  async watch() {

    console.log(blueBright(`[anyOpsOS Cli.] Watching for file changes.\n`));

    for (const directory of await readdir(`${INTERNAL_PATH_CWD}/projects/apis`)) {

        if (directory === 'swagger.json') continue;

        chokidar.watch(`${INTERNAL_PATH_CWD}/projects/apis/${directory}`, {
            ignored: 'node_modules',
            persistent: true
        })
        .on('change', () => runInDocker(`node .dist/cli/bin/anyopsos.js build api ${directory}`))
        .on('error', (error: string) => console.log(red(`Watcher error: ${error}`)))
        .on('ready', () => console.log(green(`Initial scan complete. Ready for changes api ${directory}`)));

    }

    for (const directory of await readdir(`${INTERNAL_PATH_CWD}/projects/modules`)) {

        chokidar.watch(`${INTERNAL_PATH_CWD}/projects/modules/${directory}`, {
            ignored: 'node_modules',
            persistent: true
        })
        .on('change', () => runInDocker(`node .dist/cli/bin/anyopsos.js build module ${directory}`))
        .on('error', (error: string) => console.log(red(`Watcher error: ${error}`)))
        .on('ready', () => console.log(green(`Initial scan complete. Ready for changes module ${directory}`)));

    }

    for (const directory of await readdir(`${INTERNAL_PATH_CWD}/projects/websockets`)) {

        chokidar.watch(`${INTERNAL_PATH_CWD}/projects/websockets/${directory}`, {
            ignored: 'node_modules',
            persistent: true
        })
        .on('change', () => runInDocker(`node .dist/cli/bin/anyopsos.js build websocket ${directory}`))
        .on('error', (error: string) => console.log(red(`Watcher error: ${error}`)))
        .on('ready', () => console.log(green(`Initial scan complete. Ready for changes websocket ${directory}`)));

    }

    for (const directory of await readdir(`${INTERNAL_PATH_CWD}/projects/applications`)) {

        chokidar.watch(`${INTERNAL_PATH_CWD}/projects/applications/${directory}`, {
            ignored: 'node_modules',
            persistent: true
        })
        .on('change', () => runInDocker(`node .dist/cli/bin/anyopsos.js build application ${directory}`))
        .on('error', (error: string) => console.log(red(`Watcher error: ${error}`)))
        .on('ready', () => console.log(green(`Initial scan complete. Ready for changes application ${directory}`)));

    }

    for (const directory of await readdir(`${INTERNAL_PATH_CWD}/projects/libraries`)) {

        chokidar.watch(`${INTERNAL_PATH_CWD}/projects/libraries/${directory}`, {
            ignored: 'node_modules',
            persistent: true
        })
        .on('change', () => runInDocker(`node .dist/cli/bin/anyopsos.js build library ${directory}`))
        .on('error', (error: string) => console.log(red(`Watcher error: ${error}`)))
        .on('ready', () => console.log(green(`Initial scan complete. Ready for changes library ${directory}`)));

    }

    for (const directory of await readdir(`${INTERNAL_PATH_CWD}/projects/external-libraries`)) {

        chokidar.watch(`${INTERNAL_PATH_CWD}/projects/external-libraries/${directory}`, {
            ignored: 'node_modules',
            persistent: true
        })
        .on('change', () => runInDocker(`node .dist/cli/bin/anyopsos.js build external-library ${directory}`))
        .on('error', (error: string) => console.log(red(`Watcher error: ${error}`)))
        .on('ready', () => console.log(green(`Initial scan complete. Ready for changes external-library ${directory}`)));

    }

    for (const directory of await readdir(`${INTERNAL_PATH_CWD}/projects/modals`)) {

        chokidar.watch(`${INTERNAL_PATH_CWD}/projects/modals/${directory}`, {
            ignored: 'node_modules',
            persistent: true
        })
        .on('change', () => runInDocker(`node .dist/cli/bin/anyopsos.js build modal ${directory}`))
        .on('error', (error: string) => console.log(red(`Watcher error: ${error}`)))
        .on('ready', () => console.log(green(`Initial scan complete. Ready for changes modal ${directory}`)));

    }

    chokidar.watch(`${INTERNAL_PATH_CWD}/src/frontend`, {
        ignored: 'node_modules',
        persistent: true
    })
    .on('change', () => runInDocker(`node .dist/cli/bin/anyopsos.js build frontend`))
    .on('error', (error: string) => console.log(red(`Watcher error: ${error}`)))
    .on('ready', () => console.log(green(`Initial scan complete. Ready for changes frontend`)));

    chokidar.watch(`${INTERNAL_PATH_CWD}/src/backend-auth`, {
        ignored: 'node_modules',
        persistent: true
    })
    .on('change', () => runInDocker(`node .dist/cli/bin/anyopsos.js build backend`))
    .on('error', (error: string) => console.log(red(`Watcher error: ${error}`)))
    .on('ready', () => console.log(green(`Initial scan complete. Ready for changes backend-auth`)));

    chokidar.watch(`${INTERNAL_PATH_CWD}/src/backend-core`, {
        ignored: 'node_modules',
        persistent: true
    })
    .on('change', () => runInDocker(`node .dist/cli/bin/anyopsos.js build backend`))
    .on('error', (error: string) => console.log(red(`Watcher error: ${error}`)))
    .on('ready', () => console.log(green(`Initial scan complete. Ready for changes backend-core`)));

    chokidar.watch(`${INTERNAL_PATH_CWD}/src/backend-fileSystem`, {
        ignored: 'node_modules',
        persistent: true
    })
    .on('change', () => runInDocker(`node .dist/cli/bin/anyopsos.js build backend`))
    .on('error', (error: string) => console.log(red(`Watcher error: ${error}`)))
    .on('ready', () => console.log(green(`Initial scan complete. Ready for changes backend-fileSystem`)));

  }

}
