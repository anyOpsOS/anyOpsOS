import chalk from 'chalk';
import fs from 'fs-extra';
import awaitSpawn from 'await-spawn';

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

    console.log(blueBright(`[anyOpsOS Cli.] Preparing Kubernetes environment.\n`));

    // Prepare Kubernetes environment
    console.log(blue(`[anyOpsOS Cli. Internals] Starting Kind cluster.\n`));
    const kindContainerRunning: Buffer = await awaitSpawn('docker', ['inspect', 'anyopsos-control-plane', '--format={{.State.Running}}']).catch((e: any) => {
      if (e.stderr) {
        if (e.stderr.toString().slice(0, -1) === 'Error: No such object: anyopsos-control-plane') return;
        throw e.stderr.toString();
      }

      throw e;
    });

    if (kindContainerRunning?.toString().slice(0, -1) === 'true') await runInDocker('/usr/local/bin/kind delete cluster --name anyopsos');

    await runInDocker('/usr/local/bin/kind create cluster --config /kindconfig.yaml --name anyopsos');
    await runInDocker('sed -i.bak \'s/127.0.0.1:46443/anyopsos-control-plane:6443/g\' /root/.kube/config');

    // Prepare image registry
    console.log(blue(`[anyOpsOS Cli. Internals] Starting internal Container Registry.\n`));
    const registryContainerRunning: Buffer = await awaitSpawn('docker', ['inspect', 'anyopsos-registry', '--format={{.State.Running}}']).catch((e: any) => {
      if (e.stderr) {
        if (e.stderr.toString().slice(0, -1) === 'Error: No such object: anyopsos-registry') return;
        throw e.stderr.toString();
      }

      throw e;
    });

    if (!registryContainerRunning || registryContainerRunning?.toString().slice(0, -1) !== 'true') {
      await runInDocker('docker run -d --restart=always -p "5000:5000" --name "anyopsos-registry" registry:2');
      await runInDocker('docker network connect "kind" "anyopsos-registry"');
    }

    await runInDocker('docker network connect "kind" "anyopsos-devel"').catch((e) => console.log(e));

    await runInDocker('kubectl annotate node "anyopsos-control-plane" "kind.x-k8s.io/registry=localhost:5000";');

    // Prepare anyopsos
    console.log(blue(`[anyOpsOS Cli. Internals] Deploying configuration files.\n`));
    await runInDocker('kubectl create namespace anyopsos');

    await runInDocker('kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/ingress-nginx-2.11.2/deploy/static/provider/kind/deploy.yaml');
    await runInDocker(`kubectl patch deployment ingress-nginx-controller -n ingress-nginx --patch "$(cat ${INTERNAL_PATH_CWD}/docker/yaml/nginx-ingress-controller-patch.yaml)"`);

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

    await runInDocker('kubectl config set-context --current --namespace=anyopsos');
  }

  async logs() {
    console.log(blueBright(`[anyOpsOS Cli.] K8s logs.\n`));
    return runInDocker('stern anyopsos -n anyopsos -t');
  }

  async attach() {
    console.log(blueBright(`[anyOpsOS Cli.] Attaching to Devel Container.\n`));
    return runInDocker('bash');
  }

  async download() {
    console.log(blueBright(`[anyOpsOS Cli.] Download anyOpsOS files.\n`));
    return runInDocker('find . -delete && git clone https://github.com/anyOpsOS/anyOpsOS .');
  }

  async install() {
    console.log(blueBright(`[anyOpsOS Cli.] Installing required dependencies.\n`));
    return runInDocker('export NODE_OPTIONS="" && yarn install --link-duplicates --ignore-engines');
  }

  async certificate() {
    console.log(blueBright(`[anyOpsOS Cli.] Generating encryption keys and SSL certificates.\n`));
    return runInDocker('cd docker && ./crt.sh');
  }

  async build() {
    console.log(blueBright(`[anyOpsOS Cli.] Building main anyOpsOS Docker images.\n`));

    console.log(blue(`[anyOpsOS Cli. Internals] Creating Docker Auth Image.`));
    await runInDocker('docker build -f docker/Dockerfile.auth -t anyopsos-auth ./docker');
    await runInDocker('docker tag anyopsos-auth:latest localhost:5000/anyopsos-auth:latest');
    await runInDocker('docker push localhost:5000/anyopsos-auth:latest');

    console.log(blue(`[anyOpsOS Cli. Internals] Creating Docker Core Image.`));
    await runInDocker('docker build -f docker/Dockerfile.core -t anyopsos-core ./docker');
    await runInDocker('docker tag anyopsos-core:latest localhost:5000/anyopsos-core:latest');
    await runInDocker('docker push localhost:5000/anyopsos-core:latest');

    console.log(blue(`[anyOpsOS Cli. Internals] Creating Docker FileSystem Image.`));
    await runInDocker('docker build -f docker/Dockerfile.fileSystem -t anyopsos-filesystem ./docker');
    await runInDocker('docker tag anyopsos-filesystem:latest localhost:5000/anyopsos-filesystem:latest');
    await runInDocker('docker push localhost:5000/anyopsos-filesystem:latest');
  }

  async prepare(args: { force: any }) {
    if (args.force) console.log(red(`[anyOpsOS Cli. Internals] Force recreation of Docker Development Image and Container.`));

    // Check if devel container is already created
    const dockerContainers: Buffer = await awaitSpawn('docker', ['ps', '-a', '--format=\'{{json .Names}}\'']).catch((e: any) => {
      if (e.stderr) throw e.stderr.toString();
      throw e;
    });

    const containerExists = dockerContainers.toString().includes('"anyopsos-devel"');

    if (containerExists) {

      // Stop here
      if (!args.force) return console.log(yellow(`[anyOpsOS Cli. Internals] Docker Development container already exists.`));

      await awaitSpawn('docker', ['rm', '--force', 'anyopsos-devel']).catch((e: any) => {
        if (e.stderr) throw e.stderr.toString();
      throw e;
      });

    }

    // Check if devel image is already created
    const dockerImages: string = await awaitSpawn('docker', ['images', '--format=\'{{json .Repository}}\'']).catch((e: any) => {
      if (e.stderr) throw e.stderr.toString();
      throw e;
    });

    const imageExists = dockerImages.toString().includes('"anyopsos-devel"');

    // Create image
    if (!imageExists || args.force) {

      console.log(blueBright(`[anyOpsOS Cli.] Creating Docker Development Image.`));

      // Build devel image
      await awaitSpawn('docker', ['build', '-f', 'docker/Dockerfile.devel', '-t', 'anyopsos-devel', './docker'], {
        cwd: MAIN_PATH_CWD,
        stdio: 'inherit'
      }).catch((e: any) => {
        if (e.stderr) throw e.stderr.toString();
      throw e;
      });
    }

    // Check if volume is already created
    const dockerVolumes: string = await awaitSpawn('docker', ['volume', 'ls', '--format=\'{{json .Name}}\'']).catch((e: any) => {
      if (e.stderr) throw e.stderr.toString();
      throw e;
    });

    const volumeExists: boolean = dockerVolumes.toString().includes('"anyopsos-data"');

    // Create image
    if (!volumeExists || args.force) {

      console.log(blueBright(`[anyOpsOS Cli.] Creating Docker Development Volume.`));

      // Create data volume
      await awaitSpawn('docker', ['volume', 'create', 'anyopsos-data']).catch((e: any) => {
        if (e.stderr) throw e.stderr.toString();
      throw e;
      });
    }

    // Check if code folder exists
    if (!pathExistsSync(`${INTERNAL_PATH_CWD}/code`)) {
      const dockerVolumePath: string = await awaitSpawn('docker', ['volume', 'inspect', 'anyopsos-data', '--format=\'{{json .Mountpoint}}\'']).catch((e: any) => {
        if (e.stderr) throw e.stderr.toString();
        throw e;
      });

      await ensureSymlink(dockerVolumePath.toString().slice(2, -3), `${INTERNAL_PATH_CWD}/code`);
    }

    console.log(blueBright(`[anyOpsOS Cli.] Creating Docker Development container.`));

    await ensureFile('ssh.key');

    // Run container
    await awaitSpawn('docker', [
      'run',
      // '--rm',
      '-d',
      '-p', '2222:22',
      // '-e', 'NODE_OPTIONS=--no-warnings --experimental-loader /var/www/.dist/cli/src/https-loader.js --experimental-specifier-resolution=node',
      '--mount', `src=anyopsos-data,target=${INTERNAL_PATH_CWD},type=volume`,
      '--mount', `src=${MAIN_PATH_CWD}/ssh.key,target=/root/id_rsa,type=bind,consistency=delegated`,
      '-v', '/var/run/docker.sock:/var/run/docker.sock',
      '--name', 'anyopsos-devel',
      'anyopsos-devel'
    ], {
      cwd: MAIN_PATH_CWD,
      stdio: 'inherit'
    }).catch((e: any) => {
      if (e.stderr) throw e.stderr.toString();
      throw e;
    });

    console.log(red(`[anyOpsOS Cli.] SSH key file [ssh.key] generated. Use this key to manage the container files from your IDE.`));
  }
}
