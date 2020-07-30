import { TestBed } from '@angular/core/testing';

import { AnyOpsOSExtLibDygraphsService } from './anyopsos-ext-lib-dygraphs.service';

describe('AnyOpsOSExtLibDygraphsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSExtLibDygraphsService = TestBed.inject(AnyOpsOSExtLibDygraphsService);
    expect(service).toBeTruthy();
  });
});
