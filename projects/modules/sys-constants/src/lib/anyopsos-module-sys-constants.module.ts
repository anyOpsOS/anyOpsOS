import fs from 'fs-extra';

// TODO ESM
const { readFileSync, pathExistsSync } = fs;

/**
 * Redis
 */
export const AOO_REDIS_HOST: string = process.env.AOO_REDIS_HOST ?? 'redis.anyopsos.local';
export const AOO_REDIS_PORT: string = process.env.AOO_REDIS_PORT ?? '6379';

/**
 * Vault
 */
export const AOO_VAULT_HOST: string = process.env.AOO_VAULT_HOST ?? 'vault.anyopsos.local';
export const AOO_VAULT_PORT: string = process.env.AOO_VAULT_PORT ?? '443';
export const AOO_VAULT_SECRET_SHARES: string = process.env.AOO_VAULT_SECRET_SHARES ?? '5';
export const AOO_VAULT_SECRET_THRESHOLD: string = process.env.AOO_VAULT_SECRET_THRESHOLD ?? '3';
export const AOO_VAULT_API_VERSION: string = process.env.VAULT_APIVERSION ?? 'v1';

/**
 * anyOpsOS hostnames
 */
export const AOO_FILESYSTEM_HOST: string = process.env.AOO_FILESYSTEM_HOST ?? 'filesystem.anyopsos.local';
export const AOO_FILESYSTEM_PORT: string = process.env.AOO_FILESYSTEM_PORT ?? '443';
export const AOO_AUTH_HOST: string = process.env.AOO_AUTH_HOST ?? 'auth.anyopsos.local';
export const AOO_AUTH_PORT: string = process.env.AOO_AUTH_PORT ?? '443';
export const AOO_CORE_HOST: string = process.env.AOO_CORE_HOST ?? 'core.anyopsos.local';
export const AOO_CORE_PORT: string = process.env.AOO_CORE_PORT ?? '443';

export const AOO_ANYOPSOS_TYPE: 'filesystem' | 'auth' | 'core' | string = process.env.AOO_ANYOPSOS_TYPE ?? 'core';
export const AOO_BASE_PATH: string = process.env.AOO_BASE_PATH ?? '/var/www';

/**
 * Session params
 */
export const AOO_SESSION_COOKIE: string = process.env.AOO_SESSION_COOKIE ?? 'anyOpsOS';
export const AOO_SESSION_COOKIE_SECRET: string = process.env.AOO_SESSION_COOKIE_SECRET ?? 'anyOpsOSSecret';
export const AOO_UNIQUE_COOKIE_NAME: string = process.env.AOO_UNIQUE_COOKIE_NAME ?? 'uniqueId';
export const AOO_IMPERSONATE_HEADER: string = 'anyopsos-impersonate';

/**
 * Certificates
 */
const DEFAULT_DHPARAM: () => string = () => pathExistsSync('/dev/shm/dhparam.pem') ? readFileSync('/dev/shm/dhparam.pem').toString() : '';
const DEFAULT_CA: () => string = () => pathExistsSync('/dev/shm/ca.cert') ? readFileSync('/dev/shm/ca.cert').toString() : '';
const DEFAULT_CERT: () => string = () => pathExistsSync('/dev/shm/server.cert') ? readFileSync('/dev/shm/server.cert').toString() : '';
const DEFAULT_CERT_KEY: () => string = () => pathExistsSync('/dev/shm/server.key') ? readFileSync('/dev/shm/server.key').toString() : '';

export const SSL_DHPARAM: string = process.env.SSL_DHPARAM ?? DEFAULT_DHPARAM();
export const SSL_CA_CERT: string = process.env.SSL_CA_CERT ?? DEFAULT_CA();

export const SSL_AUTH_CERT: string = process.env.SSL_AUTH_CERT ?? DEFAULT_CERT();
export const SSL_AUTH_CERT_KEY: string = process.env.SSL_AUTH_CERT_KEY ?? DEFAULT_CERT_KEY();
export const SSL_FILESYSTEM_CERT: string = process.env.SSL_FILESYSTEM_CERT ?? DEFAULT_CERT();
export const SSL_FILESYSTEM_CERT_KEY: string = process.env.SSL_FILESYSTEM_CERT_KEY ?? DEFAULT_CERT_KEY();
export const SSL_CORE_CERT: string = process.env.SSL_CORE_CERT ?? DEFAULT_CERT();
export const SSL_CORE_CERT_KEY: string = process.env.SSL_CORE_CERT_KEY ?? DEFAULT_CERT_KEY();

/**
 * Backend Controllers
 */
export const AOO_AUTH_CONTROLLERS: string[] = [
  `https://${AOO_FILESYSTEM_HOST}:${AOO_FILESYSTEM_PORT}/api/file/${encodeURIComponent('bin/apis/auth/index.js')}`,
  `https://${AOO_FILESYSTEM_HOST}:${AOO_FILESYSTEM_PORT}/api/file/${encodeURIComponent('bin/apis/credential/index.js')}`,
  `https://${AOO_FILESYSTEM_HOST}:${AOO_FILESYSTEM_PORT}/api/file/${encodeURIComponent('bin/apis/vault/index.js')}`,
  `https://${AOO_FILESYSTEM_HOST}:${AOO_FILESYSTEM_PORT}/api/file/${encodeURIComponent('bin/apis/workspace/index.js')}`
];

export const AOO_FILESYSTEM_CONTROLLERS: string[] = [
  'apis/config-file/index.js',
  'apis/file/index.js',
  'apis/folder/index.js',
  'apis/loader/index.js'
];

// List of API Controllers to not load on Code Backend
export const AOO_NOT_CORE_CONTROLLERS: string[] = ['auth', 'credential', 'vault', 'workspace', 'config-file', 'file', 'folder', 'loader'];