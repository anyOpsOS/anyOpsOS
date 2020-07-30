import { TestBed } from '@angular/core/testing';

import { AnyOpsOSLibNodeLinuxHelpersService } from './anyopsos-lib-node-linux-helpers.service';

describe('AnyOpsOSLibNodeLinuxHelpersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSLibNodeLinuxHelpersService = TestBed.inject(AnyOpsOSLibNodeLinuxHelpersService);
    expect(service).toBeTruthy();
  });
});
