import { AnyOpsOSSysApiCallerModule } from '@anyopsos/module-sys-api-caller';
import { AOO_ANYOPSOS_TYPE } from '@anyopsos/module-sys-constants';

// This decorator allows other backends to manage the filesystem
// Instead of managing the files itself, this will call the anyopsos-filesystem API
export function ApiCaller() {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

    const method = descriptor.value; // references the method being decorated
    descriptor.value = function (...args: any[]) {

      // Call the original event
      if (AOO_ANYOPSOS_TYPE === 'auth') return method.apply(this, args);

      const ApiCallerModule: AnyOpsOSSysApiCallerModule = new AnyOpsOSSysApiCallerModule();

      // Rewrite the method to call the anyopsos-filesystem API
      if (propertyKey === 'getWorkspacesDetails') return ApiCallerModule.call('auth', 'GET', `/api/workspace/`, null, (this as any).userUuid);
      if (propertyKey === 'getWorkspaceByUuid') return ApiCallerModule.call('auth', 'GET', `/api/workspace/${args[0]}/`, null, (this as any).userUuid);
      if (propertyKey === 'getDefaultWorkspace') return ApiCallerModule.call('auth', 'GET', `/api/workspace/?onlyDefault=true`, null, (this as any).userUuid);
    };
  };
}