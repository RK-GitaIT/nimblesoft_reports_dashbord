import { TestBed } from '@angular/core/testing';

import { FormsCrudService } from './forms-crud.service';

describe('FormsCrudService', () => {
  let service: FormsCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormsCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
