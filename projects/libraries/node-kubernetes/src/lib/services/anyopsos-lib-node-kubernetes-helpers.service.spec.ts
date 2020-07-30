import { TestBed } from '@angular/core/testing';

import { AnyOpsOSLibNodeKubernetesHelpersService } from './anyopsos-lib-node-kubernetes-helpers.service';

describe('AnyOpsOSLibNodeKubernetesHelpersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSLibNodeKubernetesHelpersService = TestBed.inject(AnyOpsOSLibNodeKubernetesHelpersService);
    expect(service).toBeTruthy();
  });
});
