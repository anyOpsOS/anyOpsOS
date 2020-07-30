import { TestBed } from '@angular/core/testing';

import { AnyOpsOSLibNodeService } from './anyopsos-lib-node.service';

describe('AnyOpsOSLibNodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSLibNodeService = TestBed.inject(AnyOpsOSLibNodeService);
    expect(service).toBeTruthy();
  });
});
