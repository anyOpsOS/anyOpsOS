import {AnyOpsOSSysApiCallerModule} from '@anyopsos/module-sys-api-caller';
import {AOO_ANYOPSOS_TYPE} from '@anyopsos/module-sys-constants';

// This decorator allows other backends to manage the credentials
// Instead of managing the files itself, this will call the anyopsos-auth API
export function ApiCaller() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  
      const method = descriptor.value; // references the method being decorated
      descriptor.value = function(...args: any[]) {
  
        // Call the original event
        if (AOO_ANYOPSOS_TYPE === 'auth') return method.apply(this, args);
  
        const ApiCallerModule: AnyOpsOSSysApiCallerModule = new AnyOpsOSSysApiCallerModule();
        
        // Rewrite the method to call the anyopsos-auth API
        if (propertyKey === 'getCredentials') return ApiCallerModule.call('filesystem', 'GET', `/api/credential/${(this as any).workspaceUuid}`);
        //if (propertyKey === 'getCredential') return ApiCallerModule.call('filesystem', 'PUT', `/api/credential/${encodeURIComponent(args[0])}`);
        if (propertyKey === 'putCredential') return ApiCallerModule.call('filesystem', 'PUT', `/api/credential/${(this as any).workspaceUuid}`, { credential: args[0] });
        if (propertyKey === 'patchCredential') return ApiCallerModule.call('filesystem', 'PUT', `/api/credential/${(this as any).workspaceUuid}/${encodeURIComponent(args[0])}`, { credential: args[1] });
        if (propertyKey === 'deleteCredential') return ApiCallerModule.call('filesystem', 'PUT', `/api/credential/${(this as any).workspaceUuid}/${encodeURIComponent(args[0])}`);
      };
    };
  }