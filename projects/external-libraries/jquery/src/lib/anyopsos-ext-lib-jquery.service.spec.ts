import { TestBed } from '@angular/core/testing';

import { AnyOpsOSExtLibJqueryService } from './anyopsos-ext-lib-jquery.service';

describe('AnyOpsOSExtLibJqueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSExtLibJqueryService = TestBed.inject(AnyOpsOSExtLibJqueryService);
    expect(service).toBeTruthy();
  });
});
