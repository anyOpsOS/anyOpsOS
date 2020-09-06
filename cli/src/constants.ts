import { fileURLToPath } from 'url';

// TODO HARDCODED
export const MAIN_PATH_CWD: string = fileURLToPath(import.meta.url).replace('src/constants.js', '');
export const INTERNAL_PATH_CWD: string = '/var/www';
