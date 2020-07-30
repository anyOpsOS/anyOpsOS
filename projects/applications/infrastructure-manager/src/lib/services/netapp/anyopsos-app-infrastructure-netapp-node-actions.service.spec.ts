import { TestBed } from '@angular/core/testing';

import { AnyOpsOSAppInfrastructureNetappNodeActionsService } from './anyopsos-app-infrastructure-netapp-node-actions.service';

describe('AnyOpsOSAppInfrastructureNetappNodeActionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSAppInfrastructureNetappNodeActionsService = TestBed.inject(AnyOpsOSAppInfrastructureNetappNodeActionsService);
    expect(service).toBeTruthy();
  });
});
