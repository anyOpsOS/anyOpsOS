import { TestBed } from '@angular/core/testing';

import { AnyOpsOSLibNodeDockerService } from './anyopsos-lib-node-docker.service';

describe('AnyOpsOSLibNodeDockerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSLibNodeDockerService = TestBed.inject(AnyOpsOSLibNodeDockerService);
    expect(service).toBeTruthy();
  });
});
