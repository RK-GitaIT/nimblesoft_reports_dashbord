import { TestBed } from '@angular/core/testing';

import { LeaglDocumentsService } from './leagl-documents.service';

describe('LeaglDocumentsService', () => {
  let service: LeaglDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaglDocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
