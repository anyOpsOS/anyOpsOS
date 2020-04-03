import {get} from 'https';
import {dirname} from 'path';

export function resolve(specifier: string, context: { parentURL?: any }, defaultResolve: (...args: any) => any) {
  const { parentURL = null } = context;

  // Normally Node.js would error on specifiers starting with 'https://', so
  // this hook intercepts them and converts them into absolute URLs to be
  // passed along to the later hooks below.
  if (specifier.startsWith('@anyopsos/module-')) {

    return {
      url: `https://filesystem.anyopsos.local/api/file/${encodeURIComponent( `${specifier.replace('@anyopsos/module-', 'bin/modules/')}/index.js` )}`
    };

  } else if (specifier.startsWith('@anyopsos/api-middleware-')) {

    return {
      url: `https://filesystem.anyopsos.local/api/file/${encodeURIComponent( `${specifier.replace('@anyopsos/api-middleware-', 'bin/api-middlewares/')}/index.js` )}`
    };

  } else if (specifier.startsWith('@anyopsos/api-')) {

    return {
      url: `https://filesystem.anyopsos.local/api/file/${encodeURIComponent( `${specifier.replace('@anyopsos/api-', 'bin/apis/')}/index.js` )}`
    };

  // Right now we don't use this case directly. Ex: import {xx} from 'https://filesystem.anyopsos.local/api/file/something.js'
  } else if (specifier.startsWith('https://')) {

    return {
      url: specifier
    };

  // Https loaded module that requires a child file
  } else if (parentURL && parentURL.startsWith('https://')) {

    if (specifier.startsWith('.')) {
      // Get parent location and add the current specifier file
      const previousFile: string = decodeURIComponent(new URL(parentURL).pathname).replace('/api/file/', '');
      const previousPath: string = dirname(previousFile) + '/';
      const currentFile: string = previousPath + specifier + '.js'
      return {
        url: new URL(`https://filesystem.anyopsos.local/api/file/${encodeURIComponent( currentFile )}`, parentURL).href
      };

    } else {
      context.parentURL = 'file:///var/www/app.js';
    }
    
  }

  // Let Node.js handle all other specifiers.
  return defaultResolve(specifier, context, defaultResolve);
}

export function getFormat(url: string, context: { parentURL?: any }, defaultGetFormat: (...args: any) => any) {
  // This loader assumes all network-provided JavaScript is ES module code.

  if (url.startsWith('https://')) {

    return {
      format: 'module'
    };
  }

  // Let Node.js handle all other URLs.
  return defaultGetFormat(url, context, defaultGetFormat);
}

export function getSource(url: string, context: { parentURL?: any }, defaultGetSource: (...args: any) => any) {
  // For JavaScript to be loaded over the network, we need to fetch and
  // return it.

  if (url.startsWith('https://')) {

    return new Promise((resolve, reject) => {
      get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          return resolve({ source: data })
        });
      }).on('error', (err) => reject(err));
    });
  }

  // Let Node.js handle all other URLs.
  return defaultGetSource(url, context, defaultGetSource);
}