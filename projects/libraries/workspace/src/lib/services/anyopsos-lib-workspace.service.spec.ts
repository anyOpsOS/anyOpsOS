import { TestBed } from '@angular/core/testing';

import { AnyOpsOSLibWorkspaceService } from './anyopsos-lib-workspace.service';

describe('AnyOpsOSLibWorkspaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSLibWorkspaceService = TestBed.inject(AnyOpsOSLibWorkspaceService);
    expect(service).toBeTruthy();
  });
});
