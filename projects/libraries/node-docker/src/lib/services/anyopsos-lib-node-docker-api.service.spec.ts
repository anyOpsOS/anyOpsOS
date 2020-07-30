import { TestBed } from '@angular/core/testing';

import { AnyOpsOSLibNodeDockerApiService } from './anyopsos-lib-node-docker-api.service';

describe('AnyOpsOSLibNodeDockerApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSLibNodeDockerApiService = TestBed.inject(AnyOpsOSLibNodeDockerApiService);
    expect(service).toBeTruthy();
  });
});
