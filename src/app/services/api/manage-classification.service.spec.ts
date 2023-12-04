import { TestBed } from '@angular/core/testing';

import { ManageClassificationService } from './manage-classification.service';

describe('ManageClassificationService', () => {
  let service: ManageClassificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageClassificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
