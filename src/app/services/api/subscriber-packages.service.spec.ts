import { TestBed } from '@angular/core/testing';
import { MangeSubscriberPackagesService } from './subscriber-packages.service';

describe('MangeSubscriberPackagesService', () => {
  let service: MangeSubscriberPackagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MangeSubscriberPackagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
