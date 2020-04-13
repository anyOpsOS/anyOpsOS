import { TestBed } from '@angular/core/testing';

import { AnyopsosLibDesktopService } from './anyopsos-lib-desktop.service';

describe('AnyopsosLibDesktopService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyopsosLibDesktopService = TestBed.get(AnyopsosLibDesktopService);
    expect(service).toBeTruthy();
  });
});
