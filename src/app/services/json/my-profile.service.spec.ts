import { TestBed } from '@angular/core/testing';

import { myProfileService } from './my-profile.service';

describe('MyProfileService', () => {
  let service: myProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(myProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
