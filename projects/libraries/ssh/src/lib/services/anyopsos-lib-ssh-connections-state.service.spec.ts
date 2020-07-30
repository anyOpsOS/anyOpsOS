import { TestBed } from '@angular/core/testing';

import { AnyOpsOSLibSshConnectionsStateService } from './anyopsos-lib-ssh-connections-state.service';

describe('AnyOpsOSLibSshConnectionsStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSLibSshConnectionsStateService = TestBed.inject(AnyOpsOSLibSshConnectionsStateService);
    expect(service).toBeTruthy();
  });
});
