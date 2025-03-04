import { TestBed } from '@angular/core/testing';

import { ProfilesCrudService } from './profiles-crud.service';

describe('ProfilesCrudService', () => {
  let service: ProfilesCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfilesCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
