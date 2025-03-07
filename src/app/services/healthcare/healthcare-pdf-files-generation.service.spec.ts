import { TestBed } from '@angular/core/testing';

import { HealthcarePdfFilesGenerationService } from './healthcare-pdf-files-generation.service';

describe('HealthcarePdfFilesGenerationService', () => {
  let service: HealthcarePdfFilesGenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthcarePdfFilesGenerationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
