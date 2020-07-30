import { TestBed } from '@angular/core/testing';

import { AnyOpsOSLibNodeHelpersService } from './anyopsos-lib-node-helpers.service';

describe('AnyOpsOSLibNodeHelpersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSLibNodeHelpersService = TestBed.inject(AnyOpsOSLibNodeHelpersService);
    expect(service).toBeTruthy();
  });
});
