import {MAIN_PATH_CWD} from './constants.js';

export function resolve(specifier: string, context: { parentURL?: any }, defaultResolve: (...args: any) => any) {
  const { parentURL = null } = context;

  // Normally Node.js would error on specifiers starting with @anyopsos', so
  // this hook intercepts them and converts them into absolute URLs to be
  // passed along to the later hooks below.
  if (specifier.startsWith('@anyopsos/module-')) {

    return {
      url: specifier.replace('@anyopsos/module-', `file://${MAIN_PATH_CWD}/.dist/modules/`) + '/index.js'
    };

  } else if (specifier.startsWith('@anyopsos/api-middleware-')) {

    return {
      url: specifier.replace('@anyopsos/api-middleware-', `file://${MAIN_PATH_CWD}/.dist/api-middlewares/`) + '/index.js'
    };

  } else if (specifier.startsWith('@anyopsos/api-')) {

    return {
      url: specifier.replace('@anyopsos/api-', `file://${MAIN_PATH_CWD}/.dist/apis/`) + '/index.js'
    };

  } else if (parentURL && parentURL.startsWith('@anyopsos/')) {

    console.log(new URL(specifier, parentURL).href);

    return {
      url: new URL(specifier, parentURL).href
    };
  }

  // Let Node.js handle all other specifiers.
  return defaultResolve(specifier, context, defaultResolve);
}

export function getFormat(url: string, context: { parentURL?: any }, defaultGetFormat: (...args: any) => any) {
  // This loader assumes all anyOpsOS JavaScript is ES module code.
  if (url.startsWith(`file://${MAIN_PATH_CWD}/.dist/`)) {

    return {
      format: 'module'
    };
  }

  // Let Node.js handle all other URLs.
  // return defaultGetFormat(url, context, defaultGetFormat);
  return {
    format: 'commonjs'
  };
}