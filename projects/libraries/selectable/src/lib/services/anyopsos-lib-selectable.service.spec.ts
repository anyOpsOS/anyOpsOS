import { TestBed } from '@angular/core/testing';

import { AnyOpsOSLibSelectableService } from './anyopsos-lib-selectable.service';

describe('AnyOpsOSLibSelectableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSLibSelectableService = TestBed.inject(AnyOpsOSLibSelectableService);
    expect(service).toBeTruthy();
  });
});
