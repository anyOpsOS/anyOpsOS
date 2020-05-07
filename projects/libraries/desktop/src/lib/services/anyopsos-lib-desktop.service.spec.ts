import { TestBed } from '@angular/core/testing';

import { AnyOpsOSLibDesktopService } from './anyopsos-lib-desktop.service';

describe('AnyOpsOSLibDesktopService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSLibDesktopService = TestBed.get(AnyOpsOSLibDesktopService);
    expect(service).toBeTruthy();
  });
});
