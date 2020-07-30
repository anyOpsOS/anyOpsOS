import { TestBed } from '@angular/core/testing';

import { AnyOpsOSLibNodeLinuxService } from './anyopsos-lib-node-linux.service';

describe('AnyOpsOSLibNodeLinuxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSLibNodeLinuxService = TestBed.inject(AnyOpsOSLibNodeLinuxService);
    expect(service).toBeTruthy();
  });
});
