# Requirements

- Yor IDE must support Project sources from `SSH server`, `SFTP`, `WSL` or `Docker container/volume`.

- Have `npm` or `yarn` installed.
- Have `docker` installed.
- Have a Kubernetes environment ready and `kubectl`. 

# Preparation

- Install the management client

`$ npm install -g @anyopsos/cli`

- Set node env

`$ NODE_OPTIONS="--experimental-specifier-resolution=node"`

- Prepare the development container

`$ anyopsos docker prepare`

> NOTE: This will create a file called `ssh.key`. You can use it to connect with the docker container using SSH/SFTP

- Clone `anyOpsOS` repository inside the container

`$ anyopsos docker download`

- Install all required dependencies

`$ anyopsos docker install`

-  Create all required certificates used to comunicate between Pods

`$ anyopsos docker certificates`

-  Build required Dockerfiles to be used in K8s

`$ anyopsos docker build`

-  Deploy all required Kubernetes yaml configurations

`$ anyopsos docker k8s`


# Manage anyOpsOS development files

Open your IDE project from `\\wsl$\docker-desktop-data\mnt\wsl\docker-desktop-data\data\docker\volumes\anyopsos-data\_data`, through an SSH/SFTP connection to `root@localhost:2222/var/www` using the `ssh.key` file created, or directly attaching the workspace to the container `anyopsos-devel`.

```
kubectl create namespace anyopsos

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.30.0/deploy/static/mandatory.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.30.0/deploy/static/provider/cloud-generic.yaml

kubectl create secret generic anyopsos-certificates -n anyopsos \
--from-file=./docker/certificates/ca/ca.cert \
--from-file=./docker/certificates/vault/vault.cert \
--from-file=./docker/certificates/vault/vault.key \
--from-file=./docker/certificates/auth/auth.cert \
--from-file=./docker/certificates/auth/auth.key \
--from-file=./docker/certificates/core/core.cert \
--from-file=./docker/certificates/core/core.key \
--from-file=./docker/certificates/filesystem/filesystem.cert \
--from-file=./docker/certificates/filesystem/filesystem.key \
--from-file=./docker/certificates/dhparam.pem

kubectl create configmap vault-config -n anyopsos --from-file=docker/assets/vault.json

kubectl apply -f docker/yaml/
```
