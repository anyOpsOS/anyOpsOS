import { TestBed } from '@angular/core/testing';

import { AnyOpsOSLibSshHelpersService } from './anyopsos-lib-ssh-helpers.service';

describe('AnyOpsOSLibSshHelpersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSLibSshHelpersService = TestBed.inject(AnyOpsOSLibSshHelpersService);
    expect(service).toBeTruthy();
  });
});
