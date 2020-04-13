import {AnyOpsOSSysApiCallerModule} from '@anyopsos/module-sys-api-caller';
import {AOO_ANYOPSOS_TYPE} from '@anyopsos/module-sys-constants';

// This decorator allows other backends to manage the filesystem
// Instead of managing the files itself, this will call the anyopsos-filesystem API
export function ApiCaller() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  
      const method = descriptor.value; // references the method being decorated
      descriptor.value = function(...args: any[]) {
  
        // Call the original event
        if (AOO_ANYOPSOS_TYPE === 'filesystem') return method.apply(this, args);
  
        const ApiCallerModule: AnyOpsOSSysApiCallerModule = new AnyOpsOSSysApiCallerModule();
        
        // Rewrite the method to call the anyopsos-filesystem API
        if (propertyKey === 'getFolder') return ApiCallerModule.call('filesystem', 'GET', `/api/folder/${encodeURIComponent(args[0])}`);
        if (propertyKey === 'putFolder') return ApiCallerModule.call('filesystem', 'PUT', `/api/folder/${encodeURIComponent(args[0])}`);
  
        if (propertyKey === 'getFile') return ApiCallerModule.call('filesystem', 'GET', `/api/file/${encodeURIComponent(args[0])}`);
        if (propertyKey === 'putFile') return ApiCallerModule.call('filesystem', 'PUT', `/api/file/${encodeURIComponent(args[1])}`, { file: args[0] });
        if (propertyKey === 'patchFdownloadFileFromUrlile') return ApiCallerModule.call('filesystem', 'POST', `/api/file/download_from_url`, { url: args[0], dstPath: args[1], credentialUuid: args[2] });
        if (propertyKey === 'patchFile') return ApiCallerModule.call('filesystem', 'PATCH', `/api/file/${args[0]}/${encodeURIComponent(args[1])}`, { dstPath: args[2] });
        if (propertyKey === 'patchFilePermissions') return ApiCallerModule.call('filesystem', 'PATCH', `/api/file/${args[0]}/${encodeURIComponent(args[1])}`, { permissions: args[2] });
        if (propertyKey === 'deleteFile') return ApiCallerModule.call('filesystem', 'DELETE', `/api/file/${encodeURIComponent(args[0])}`);
      };
    };
  }