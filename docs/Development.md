# Requirements

## Windows

- Docker for Windows with Kubernetes enabled. Or any Kubernetes instance (like Minikube)
- Yor IDE must support Project sources from SSH server or WSL.

###Prepare the environment:
```
# Create a docker container with all the tools.
#
# NOTE: This will create a file called ssh.key.
# You can use it to connect to the docker container using SSH/SFTP
$ anyopsos.exe docker prepare

# Clone the development repository
$ anyopsos.exe docker download

# Install all required dependencies
$ anyopsos.exe docker install

# Create all required certificated used to comunicate the Pods
$ anyopsos.exe docker certificates

# Deploy all required Kubernetes yaml conofigurations
$ anyopsos.exe docker k8s
```

### Manage anyOpsOS development files

Open your IDE project from `\\wsl$\docker-desktop-data\mnt\wsl\docker-desktop-data\data\docker\volumes\anyopsos-data\_data` or through an SSH connection to `root@localhost:2222/var/www` using the `ssh.key` file created.

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
