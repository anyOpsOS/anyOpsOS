import { TestBed } from '@angular/core/testing';

import { AnyOpsOSLibNodeKubernetesObjectHelpersService } from './anyopsos-lib-node-kubernetes-object-helpers.service';

describe('AnyOpsOSLibNodeKubernetesObjectHelpersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSLibNodeKubernetesObjectHelpersService = TestBed.inject(AnyOpsOSLibNodeKubernetesObjectHelpersService);
    expect(service).toBeTruthy();
  });
});
