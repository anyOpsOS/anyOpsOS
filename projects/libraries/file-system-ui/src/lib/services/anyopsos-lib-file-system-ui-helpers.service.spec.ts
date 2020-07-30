import { TestBed } from '@angular/core/testing';

import { AnyOpsOSLibFileSystemUiHelpersService } from './anyopsos-lib-file-system-ui-helpers.service';

describe('AnyOpsOSLibFileSystemUiHelpersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSLibFileSystemUiHelpersService = TestBed.inject(AnyOpsOSLibFileSystemUiHelpersService);
    expect(service).toBeTruthy();
  });
});
