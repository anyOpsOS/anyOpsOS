import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {AnyOpsOSLibLoggerService} from '@anyopsos/lib-logger';

import {Workspace} from '@anyopsos/module-sys-workspace/src/lib/types/workspace';
import {BackendResponse} from '@anyopsos/backend-core/app/types/backend-response';

@Injectable({
  providedIn: 'root'
})
export class AnyOpsOSLibWorkspaceService {

  private currentWorkspaceUuid: string;
  private workspaces: Workspace[];

  constructor(private readonly http: HttpClient,
              private readonly logger: AnyOpsOSLibLoggerService) {
  }

  loadWorkspaces(): Promise<void> {

    return this.http.get(`/api/workspace/`).toPromise().then(
      (workspacesData: BackendResponse & { data: Workspace[]; }) => {
        if (workspacesData.status === 'error') {
          this.logger.error('LibWorkspace', 'loadWorkspaces -> Error while getting workspaces', null, workspacesData.data);
          throw workspacesData.data;
        }

        this.workspaces = workspacesData.data;

        // Set default workspace
        const defaultWorkspaceUuid: Workspace = this.workspaces.find((workspace: Workspace) => workspace.default === true);
        this.changeWorkspace(defaultWorkspaceUuid.workspaceUuid);

        this.logger.info('LibWorkspace', 'Got workspaces successfully');
      },
      (error: any) => {
        this.logger.error('LibWorkspace', 'Error while getting workspaces', null, error);
      });

  }

  changeWorkspace(workspaceUuid: string): void {
    this.currentWorkspaceUuid = workspaceUuid;
  }

  getCurrentWorkspaceUuid(): string {
    return this.currentWorkspaceUuid;
  }

}
