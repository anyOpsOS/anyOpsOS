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
    // Prepare Kubernetes environment
    await runInDocker('/usr/local/bin/kind create cluster --config /kindconfig.yaml');

    // Prepare image registry
    await runInDocker('docker run -d --restart=always -p "46444:5000" --name "anyopsos-registry" registry:2');
    await runInDocker('docker network connect "kind" "anyopsos-registry"');
    await runInDocker('kubectl annotate node "kind-control-plane" "kind.x-k8s.io/registry=localhost:46444";');

    // Prepare anyopsos
    await runInDocker('kubectl create namespace anyopsos');
    await runInDocker('kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.30.0/deploy/static/mandatory.yaml');
    await runInDocker('kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.30.0/deploy/static/provider/cloud-generic.yaml');
    await runInDocker('kubectl create secret generic anyopsos-certificates -n anyopsos \
    --from-file=./docker/certificates/ca/ca.cert \
    --from-file=./docker/certificates/vault/vault.cert \
    --from-file=./docker/certificates/vault/vault.key \
    --from-file=./docker/certificates/auth/auth.cert \
    --from-file=./docker/certificates/auth/auth.key \
    --from-file=./docker/certificates/core/core.cert \
    --from-file=./docker/certificates/core/core.key \
    --from-file=./docker/certificates/filesystem/filesystem.cert \
    --from-file=./docker/certificates/filesystem/filesystem.key \
    --from-file=./docker/certificates/dhparam.pem');
    await runInDocker('kubectl create configmap vault-config -n anyopsos --from-file=docker/assets/vault.json');
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
    return runInDocker('cd docker && ./crt.sh');
  }

  async build() {
    console.log(blue(`[anyOpsOS Cli. Internals] Creating Docker Auth Image.`));
    await runInDocker('docker build -f docker/Dockerfile.auth -t anyopsos-auth ./docker');
    await runInDocker('docker tag anyopsos-auth:latest localhost:46444/anyopsos-auth:latest');
    await runInDocker('docker push localhost:46444/anyopsos-auth:latest');

    console.log(blue(`[anyOpsOS Cli. Internals] Creating Docker Core Image.`));
    await runInDocker('docker build -f docker/Dockerfile.core -t anyopsos-core ./docker');
    await runInDocker('docker tag anyopsos-core:latest localhost:46444/anyopsos-core:latest');
    await runInDocker('docker push localhost:46444/anyopsos-core:latest');

    console.log(blue(`[anyOpsOS Cli. Internals] Creating Docker FileSystem Image.`));
    await runInDocker('docker build -f docker/Dockerfile.fileSystem -t anyopsos-filesystem ./docker');
    await runInDocker('docker tag anyopsos-filesystem:latest localhost:46444/anyopsos-filesystem:latest');
    await runInDocker('docker push localhost:46444/anyopsos-filesystem:latest');
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
