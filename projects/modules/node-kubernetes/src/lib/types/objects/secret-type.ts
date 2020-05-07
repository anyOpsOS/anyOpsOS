export enum SecretType {
  Opaque = 'Opaque',
  ServiceAccountToken = 'kubernetes.io/service-account-token',
  Dockercfg = 'kubernetes.io/dockercfg',
  DockerConfigJson = 'kubernetes.io/dockerconfigjson',
  BasicAuth = 'kubernetes.io/basic-auth',
  SSHAuth = 'kubernetes.io/ssh-auth',
  TLS = 'kubernetes.io/tls',
  BootstrapToken = 'bootstrap.kubernetes.io/token'
}