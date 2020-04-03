import {MAIN_PATH_CWD} from './constants';

export function resolve(specifier: string, context: { parentURL?: any }, defaultResolve: (...args: any) => any) {
  const { parentURL = null } = context;

  // Normally Node.js would error on specifiers starting with 'https://', so
  // this hook intercepts them and converts them into absolute URLs to be
  // passed along to the later hooks below.
  if (specifier.startsWith('@anyopsos/module-')) {

    return {
      url: specifier.replace('@anyopsos/module-', `file://${process.cwd()}/.dist/modules/`) + '/index.js'
    };

  } else if (parentURL && parentURL.startsWith('@anyopsos/')) {

    console.log('resolve2', specifier, parentURL);
    return {
      url: new URL(specifier, parentURL).href
    };
  }

  // Let Node.js handle all other specifiers.
  return defaultResolve(specifier, context, defaultResolve);
}

export function getFormat(url: string, context: { parentURL?: any }, defaultGetFormat: (...args: any) => any) {
  // This loader assumes all network-provided JavaScript is ES module code.
  
  if (url.startsWith(`file://${MAIN_PATH_CWD}/.dist/`)) {

    return {
      format: 'module'
    };
  }

  // Let Node.js handle all other URLs.
  return defaultGetFormat(url, context, defaultGetFormat);
}