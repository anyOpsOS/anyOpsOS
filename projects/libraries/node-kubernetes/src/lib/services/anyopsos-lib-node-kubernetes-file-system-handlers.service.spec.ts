import { TestBed } from '@angular/core/testing';

import { AnyOpsOSLibNodeKubernetesFileSystemHandlersService } from './anyopsos-lib-node-kubernetes-file-system-handlers.service';

describe('AnyOpsOSLibNodeKubernetesFileSystemHandlersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSLibNodeKubernetesFileSystemHandlersService = TestBed.inject(AnyOpsOSLibNodeKubernetesFileSystemHandlersService);
    expect(service).toBeTruthy();
  });
});
