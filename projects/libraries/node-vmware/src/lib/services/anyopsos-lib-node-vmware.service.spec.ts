import { TestBed } from '@angular/core/testing';

import { AnyOpsOSLibNodeVmwareService } from './anyopsos-lib-node-vmware.service';

describe('AnyOpsOSLibNodeVmwareService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSLibNodeVmwareService = TestBed.inject(AnyOpsOSLibNodeVmwareService);
    expect(service).toBeTruthy();
  });
});
