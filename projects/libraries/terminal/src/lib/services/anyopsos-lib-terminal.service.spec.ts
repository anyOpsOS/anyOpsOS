import { TestBed } from '@angular/core/testing';

import { AnyOpsOSLibTerminalService } from './anyopsos-lib-terminal.service';

describe('AnyOpsOSLibTerminalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnyOpsOSLibTerminalService = TestBed.inject(AnyOpsOSLibTerminalService);
    expect(service).toBeTruthy();
  });
});
