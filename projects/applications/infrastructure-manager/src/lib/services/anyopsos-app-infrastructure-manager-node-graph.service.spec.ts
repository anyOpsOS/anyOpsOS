import { TestBed } from '@angular/core/testing';

import { AnyOpsOSAppInfrastructureManagerNodeGraphService } from './anyopsos-app-infrastructure-manager-node-graph.service';

describe('AnyOpsOSAppInfrastructureManagerNodeGraphService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSAppInfrastructureManagerNodeGraphService = TestBed.inject(AnyOpsOSAppInfrastructureManagerNodeGraphService);
    expect(service).toBeTruthy();
  });
});
