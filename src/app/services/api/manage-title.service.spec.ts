import { TestBed } from '@angular/core/testing';

import { ManageTitleService } from './manage-title.service';

describe('ManageTitleService', () => {
  let service: ManageTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
