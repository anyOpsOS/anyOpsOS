# Requirements

- Yor IDE must support Project sources from `SSH server`, `SFTP`, `WSL` or `Docker container/volume`.

- Have `npm` installed.
- Have `docker` installed.

# Preparation

- Install the management client

`$ npm install -g @anyopsos/cli`

> TL;DR `$ [sudo] anyopsos init` and stop here.
----

Long way:

- Prepare the development container

`$ [sudo] anyopsos docker prepare`

> NOTE: This will create a file called `ssh.key` at the current directory. You can use it to connect with the docker container using SSH/SFTP

- Clone `anyOpsOS` repository inside the container

`$ anyopsos docker download`

-  Create all required certificates used to comunicate between Pods

`$ anyopsos docker certificates`

-  Create a Kind cluster inside your Docker and deploy all required Kubernetes yaml configurations

`$ anyopsos docker k8s`

-  Build required Dockerfiles to be used in K8s

`$ anyopsos docker build`

- Install all required dependencies by anyOpsOS code

`$ anyopsos docker install`

- Compile the CLI to be used inside the docker container

`$ anyopsos build cli`

- Compile all anyOpsOS sources

`$ anyopsos build all`


# Manage anyOpsOS development files

Open your IDE project from one of this options: 
- Windows folder `\\wsl$\docker-desktop-data\mnt\wsl\docker-desktop-data\data\docker\volumes\anyopsos-data\_data`
- Linux folder `/var/lib/docker/volumes/anyopsos-data/_data`
- Through an SSH/SFTP connection to `root@localhost:46332/var/www` using the `ssh.key` file created
- Open your workspace from docker volume `anyopsos-data`
- <Recomended right now> Directly attaching the workspace to the container `anyopsos-devel`

# Manage anyOpsOS development lifecycle

`$ anyopsos docker logs` to see Kubernetes Pods logs

`$ anyopsos watch` to watch for file changes and recompile the required code

**`$ anyopsos dashboard`** all in one. Log management, watcher and more