import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';

import { AnyOpsOSLibLoggerService } from '@anyopsos/lib-logger';

@Injectable({
  providedIn: 'root'
})
export class AnyOpsOSLibBootstrapService {

  private bootstrapSource: BehaviorSubject<{ appBootstrapped: boolean; }> = new BehaviorSubject({
    appBootstrapped: false,
  });

  readonly currentBootstrapState: Observable<{ appBootstrapped: boolean; }> = this.bootstrapSource.asObservable();

  constructor(private readonly socket: Socket,
              private readonly logger: AnyOpsOSLibLoggerService) {
  }

  private setBootstrapState(data: { appBootstrapped: boolean; }): void {
    this.bootstrapSource.next(data);
  }

  init(): void {
    window.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    window.addEventListener('drop', (e) => {
      e.preventDefault();
    });

    window.addEventListener('contextmenu', (e) => {
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


    // Emit that the APP is fully loaded
    this.setBootstrapState({
      appBootstrapped: true
    });

  }
}
