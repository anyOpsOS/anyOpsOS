import { TestBed } from '@angular/core/testing';

import { AnyOpsOSAppMonitorService } from './anyopsos-app-monitor.service';

describe('AnyOpsOSAppMonitorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSAppMonitorService = TestBed.inject(AnyOpsOSAppMonitorService);
    expect(service).toBeTruthy();
  });
});
