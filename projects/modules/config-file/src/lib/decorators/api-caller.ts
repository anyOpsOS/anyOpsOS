import {AnyOpsOSSysApiCallerModule} from '@anyopsos/module-sys-api-caller';
import {AOO_ANYOPSOS_TYPE} from '@anyopsos/module-sys-constants';

// This decorator allows other backends to manage the filesystem
// Instead of managing the files itself, this will call the anyopsos-filesystem API
export function ApiCaller() {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

    const method = descriptor.value; // references the method being decorated
    descriptor.value = function(...args: any[]) {

      // Call the original event
      if (AOO_ANYOPSOS_TYPE === 'filesystem') return method.apply(this, args);

      const ApiCallerModule: AnyOpsOSSysApiCallerModule = new AnyOpsOSSysApiCallerModule();

      // Rewrite the method to call the anyopsos-filesystem API
      if (propertyKey === 'get') return ApiCallerModule.call('filesystem', 'GET', `/api/config-file/${(this as any).workspaceUuid}/${encodeURIComponent(args[0])}${args[1] ? '/' + args[1] : ''}${args[2] ? '/' + args[2] : ''}`);
      if (propertyKey === 'put') return ApiCallerModule.call('filesystem', 'PUT', `/api/config-file/${(this as any).workspaceUuid}/${encodeURIComponent(args[0])}${args[2] ? '/' + args[2] : ''}${args[3] ? '/' + args[3] : ''}`, { data: args[1] });
      if (propertyKey === 'patch') return ApiCallerModule.call('filesystem', 'PATCH', `/api/config-file/${(this as any).workspaceUuid}/${encodeURIComponent(args[0])}${args[2] ? '/' + args[2] : ''}${args[3] ? '/' + args[3] : ''}`, { data: args[1] });
      if (propertyKey === 'delete') return ApiCallerModule.call('filesystem', 'DELETE', `/api/config-file/${(this as any).workspaceUuid}/${encodeURIComponent(args[0])}${args[1] ? '/' + args[1] : ''}${args[2] ? '/' + args[2] : ''}`);
    };
  };
}