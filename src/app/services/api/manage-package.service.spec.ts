import { TestBed } from '@angular/core/testing';

import { ManagePackageService } from './manage-package.service';

describe('ManagePackageService', () => {
  let service: ManagePackageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagePackageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
