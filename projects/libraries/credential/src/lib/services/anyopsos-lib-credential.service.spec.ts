import { TestBed } from '@angular/core/testing';

import { AnyOpsOSLibCredentialService } from './anyopsos-lib-credential.service';

describe('AnyOpsOSLibCredentialService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSLibCredentialService = TestBed.inject(AnyOpsOSLibCredentialService);
    expect(service).toBeTruthy();
  });
});
