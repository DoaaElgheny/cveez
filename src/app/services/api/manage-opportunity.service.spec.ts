import { TestBed } from '@angular/core/testing';

import { ManageOpportunityService } from './manage-opportunity.service';

describe('ManageOpportunityService', () => {
  let service: ManageOpportunityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageOpportunityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
