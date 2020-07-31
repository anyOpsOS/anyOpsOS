import chalk from 'chalk';
import fs from 'fs-extra';
import awaitSpawn from 'await-spawn';
import {join} from 'path';

// TODO ESM
const {blue, blueBright, red, yellow} = chalk
const {ensureFile, pathExistsSync, ensureSymlink} = fs;

import {runInDocker} from '../utils.js';
import {INTERNAL_PATH_CWD, MAIN_PATH_CWD} from '../constants.js';

export class Docker {

  constructor() {
  }

  // TODO
  async k8s() {
    await runInDocker('kubectl create namespace anyopsos');
    await runInDocker('kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.30.0/deploy/static/mandatory.yaml');
    await runInDocker('kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.30.0/deploy/static/provider/cloud-generic.yaml');
    await runInDocker('kubectl apply -f docker/yaml/');
  }

  async attach() {
    return runInDocker('bash');
  }

  async download() {
    return runInDocker('find . -delete && git clone https://github.com/anyOpsOS/anyOpsOS .');
  }

  async install() {
    return runInDocker('export NODE_OPTIONS="" && yarn install --link-duplicates --ignore-engines');
  }

  async certificate() {
    return runInDocker('./docker/crt.sh');
  }

  async build() {
    console.log(blue(`[anyOpsOS Cli. Internals] Creating Docker Auth Image.`));
    await awaitSpawn('docker', ['build', '-f', 'docker/Dockerfile.auth', '-t', 'anyopsos-auth', './docker'], {
      cwd: MAIN_PATH_CWD,
      stdio: 'inherit'
    });

    console.log(blue(`[anyOpsOS Cli. Internals] Creating Docker Core Image.`));
    await awaitSpawn('docker', ['build', '-f', 'docker/Dockerfile.core', '-t', 'anyopsos-core', './docker'], {
      cwd: MAIN_PATH_CWD,
      stdio: 'inherit'
    });

    console.log(blue(`[anyOpsOS Cli. Internals] Creating Docker FileSystem Image.`));
    await awaitSpawn('docker', ['build', '-f', 'docker/Dockerfile.fileSystem', '-t', 'anyopsos-filesystem', './docker'], {
      cwd: MAIN_PATH_CWD,
      stdio: 'inherit'
    });
  }

  async prepare(args: { force: any }) {
    if (args.force) console.log(red(`[anyOpsOS Cli. Internals] Force recreation of Docker Development Image and Container.`));

    // Check if devel container is already created
    const dockerContainers: string = await awaitSpawn('docker', ['ps', '-a', '--format=\'{{json .Names}}\''], {
      cwd: MAIN_PATH_CWD
    });

    const containerExists = dockerContainers.toString().includes('"anyopsos-devel"');

    if (containerExists) {

      // Stop here
      if (!args.force) return console.log(yellow(`[anyOpsOS Cli. Internals] Docker Development container already exists.`));

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

      console.log(blueBright(`[anyOpsOS Cli.] Creating Docker Development Image.`));

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

    const volumeExists: boolean = dockerVolumes.toString().includes('"anyopsos-data"');

    // Create image
    if (!volumeExists || args.force) {

      console.log(blueBright(`[anyOpsOS Cli.] Creating Docker Development Volume.`));

      // Create data volume
      await awaitSpawn('docker', ['volume', 'create', 'anyopsos-data'], {
        cwd: MAIN_PATH_CWD,
        stdio: 'inherit'
      });
    }

    // Check if code folder exists
    if (!pathExistsSync(join(MAIN_PATH_CWD, 'code'))) {
      const dockerVolumePath: string = await awaitSpawn('docker', ['volume', 'inspect', 'anyopsos-data', '--format=\'{{json .Mountpoint}}\''], {
        cwd: MAIN_PATH_CWD
      });

      await ensureSymlink(dockerVolumePath.toString().slice(2, -3), join(MAIN_PATH_CWD, 'code'));
    }

    console.log(blueBright(`[anyOpsOS Cli.] Creating Docker Development container.`));

    await ensureFile('ssh.key');

    // Run container
    await awaitSpawn('docker', [
      'run',
      // '--rm',
      '-d',
      '--network', 'host',
      '-e', 'NODE_OPTIONS=--experimental-modules --experimental-loader /var/www/.dist/cli/src/https-loader.js --experimental-specifier-resolution=node',
      '--mount', `src=anyopsos-data,target=${INTERNAL_PATH_CWD},type=volume`,
      '--mount', `src=${MAIN_PATH_CWD}/ssh.key,target=/root/id_rsa,type=bind,consistency=delegated`,
      '-v', '/var/run/docker.sock:/var/run/docker.sock',
      '--name', 'anyopsos-devel',
      'anyopsos-devel'
    ], {
      cwd: MAIN_PATH_CWD,
      stdio: 'inherit'
    });

    console.log(red(`[anyOpsOS Cli.] SSH key file [ssh.key] generated. Use this key to manage the container files from your IDE.`));
  }
}
