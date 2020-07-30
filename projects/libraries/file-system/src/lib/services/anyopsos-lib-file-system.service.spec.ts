import { TestBed } from '@angular/core/testing';

import { AnyOpsOSLibFileSystemService } from './anyopsos-lib-file-system.service';

describe('AnyOpsOSLibFileSystemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSLibFileSystemService = TestBed.inject(AnyOpsOSLibFileSystemService);
    expect(service).toBeTruthy();
  });
});
