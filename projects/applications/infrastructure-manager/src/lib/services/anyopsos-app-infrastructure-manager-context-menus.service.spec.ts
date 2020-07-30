import { TestBed } from '@angular/core/testing';

import { AnyOpsOSAppInfrastructureManagerContextMenusService } from './anyopsos-app-infrastructure-manager-context-menus.service';

describe('AnyOpsOSAppInfrastructureManagerContextMenusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSAppInfrastructureManagerContextMenusService = TestBed.inject(AnyOpsOSAppInfrastructureManagerContextMenusService);
    expect(service).toBeTruthy();
  });
});
