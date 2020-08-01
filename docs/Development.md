# Requirements

- Yor IDE must support Project sources from `SSH server`, `SFTP`, `WSL` or `Docker container/volume`.

- Have `npm` or `yarn` installed.
- Have `docker` installed.

# Preparation

- Install the management client

`$ npm install -g @anyopsos/cli`

> TL;DR `$ anyopsos init` and stop here

- Prepare the development container

`$ anyopsos docker prepare`

> NOTE: This will create a file called `ssh.key`. You can use it to connect with the docker container using SSH/SFTP

- Clone `anyOpsOS` repository inside the container

`$ anyopsos docker download`

-  Create all required certificates used to comunicate between Pods

`$ anyopsos docker certificates`

-  Deploy all required Kubernetes yaml configurations

`$ anyopsos docker k8s`

-  Build required Dockerfiles to be used in K8s

`$ anyopsos docker build`

- Install all required dependencies

`$ anyopsos docker install`

- Compile all sources

`$ anyopsos build all`


# Manage anyOpsOS development files

Open your IDE project from one of this options: 
- `\\wsl$\docker-desktop-data\mnt\wsl\docker-desktop-data\data\docker\volumes\anyopsos-data\_data`
- `/var/lib/docker/volumes/anyopsos-data/_data`
- Through an SSH/SFTP connection to `root@localhost:46332/var/www` using the `ssh.key` file created
- Directly attaching the workspace to the container `anyopsos-devel`.
