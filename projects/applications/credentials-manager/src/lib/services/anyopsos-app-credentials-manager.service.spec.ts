import { TestBed } from '@angular/core/testing';

import { AnyOpsOSAppCredentialsManagerService } from './anyopsos-app-credentials-manager.service';

describe('AnyOpsOSAppCredentialsManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSAppCredentialsManagerService = TestBed.inject(AnyOpsOSAppCredentialsManagerService);
    expect(service).toBeTruthy();
  });
});
