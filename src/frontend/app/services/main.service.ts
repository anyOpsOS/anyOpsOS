import {Injectable} from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';
import {Socket} from 'ngx-socket-io';

import {AnyOpsOSLibLoggerService} from '@anyopsos/lib-logger';
import {AnyOpsOSLibLoaderService} from '@anyopsos/lib-loader';
import {AnyOpsOSLibWorkspaceService} from '@anyopsos/lib-workspace';
import {AnyOpsOSLibDesktopTaskBarService} from '@anyopsos/lib-desktop';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  private bootstrapSource: BehaviorSubject<{ appBootstrapped: boolean; }> = new BehaviorSubject({
    appBootstrapped: false,
  });

  readonly currentBootstrapState: Observable<{ appBootstrapped: boolean; }> = this.bootstrapSource.asObservable();

  constructor(private readonly socket: Socket,
              private readonly logger: AnyOpsOSLibLoggerService,
              private readonly LibLoader: AnyOpsOSLibLoaderService,
              private readonly LibWorkspace: AnyOpsOSLibWorkspaceService,
              private readonly LibDesktopTaskBar: AnyOpsOSLibDesktopTaskBarService) {
  }

  private setBootstrapState(data: { appBootstrapped: boolean; }): void {
    this.bootstrapSource.next(data);
  }

  init(): void {
    window.addEventListener( 'dragover', (e) => {
      e.preventDefault();
    });

    window.addEventListener( 'drop', (e) => {
      e.preventDefault();
    });

    window.addEventListener( 'contextmenu', (e) => {
      e.preventDefault();
    });

    // Connect to the socket
    this.socket.connect();

    this.socket.on('connect', () => {
      this.logger.info('anyOpsOS', 'Socket.io connected', null);
    });
    this.socket.on('disconnect', (err) => {
      this.logger.fatal('anyOpsOS', 'Socket.io disconnect', null, err);
    });
    this.socket.on('error', (err) => {
      this.logger.fatal('anyOpsOS', 'Socket.io error', null, err);
    });

    // Load user workspaces first, since other libraries can require it to work
    this.LibWorkspace.loadWorkspaces().then(() => {

      // Load External libraries (dependencies)
      return this.LibLoader.loadExternalLibraries();
    }).then(() => {

      // Load Application next
      return this.LibLoader.loadApplications();
    }).then(() => {

      // Since some Modals have an Application as a dependency, load it after
      return this.LibLoader.loadModals();
    }).then(() => {

      // Load Desktop TaskBar data
      return this.LibDesktopTaskBar.getTaskBarApplications();
    }).then(() => {

      // Emit that the APP is fully loaded
      this.setBootstrapState({
        appBootstrapped: true
      });
    });

  }
}
