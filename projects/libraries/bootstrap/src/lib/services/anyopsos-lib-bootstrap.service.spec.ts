import { TestBed } from '@angular/core/testing';

import { AnyopsosLibBootstrapService } from './anyopsos-lib-bootstrap.service';

describe('AnyopsosLibBootstrapService', () => {
  let service: AnyopsosLibBootstrapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnyopsosLibBootstrapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
