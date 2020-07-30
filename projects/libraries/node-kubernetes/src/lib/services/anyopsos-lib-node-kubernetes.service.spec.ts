import { TestBed } from '@angular/core/testing';

import { AnyOpsOSLibNodeKubernetesService } from './anyopsos-lib-node-kubernetes.service';

describe('AnyOpsOSLibNodeKubernetesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSLibNodeKubernetesService = TestBed.inject(AnyOpsOSLibNodeKubernetesService);
    expect(service).toBeTruthy();
  });
});
