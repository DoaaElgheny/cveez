import { TestBed } from '@angular/core/testing';

import { ManageDiscountCodesService } from './manage-discount-codes.service';

describe('ManageDiscountCodesService', () => {
  let service: ManageDiscountCodesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageDiscountCodesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
