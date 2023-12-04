import { TestBed } from '@angular/core/testing';

import { ManageClientService } from './manage-client.service';

describe('ManageClientService', () => {
  let service: ManageClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
