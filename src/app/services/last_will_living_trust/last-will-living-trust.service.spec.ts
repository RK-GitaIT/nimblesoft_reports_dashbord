import { TestBed } from '@angular/core/testing';

import { LastWillLivingTrustService } from './last-will-living-trust.service';

describe('LastWillLivingTrustService', () => {
  let service: LastWillLivingTrustService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LastWillLivingTrustService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
