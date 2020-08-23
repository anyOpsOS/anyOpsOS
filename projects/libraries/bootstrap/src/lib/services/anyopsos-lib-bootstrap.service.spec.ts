import { TestBed } from '@angular/core/testing';

import { AnyOpsOSLibBootstrapService } from './anyopsos-lib-bootstrap.service';

describe('AnyOpsOSLibBootstrapService', () => {
  let service: AnyOpsOSLibBootstrapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnyOpsOSLibBootstrapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
