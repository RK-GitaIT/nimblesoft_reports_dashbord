import { TestBed } from '@angular/core/testing';

import { LastWillTrustService } from './last-will-trust.service';

describe('LastWillTrustService', () => {
  let service: LastWillTrustService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LastWillTrustService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
