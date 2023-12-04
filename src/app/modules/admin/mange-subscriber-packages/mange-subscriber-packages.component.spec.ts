import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MangeSubscriberPackagesComponent } from './mange-subscriber-packages.component';

describe('MangeSubscriberPackagesComponent', () => {
  let component: MangeSubscriberPackagesComponent;
  let fixture: ComponentFixture<MangeSubscriberPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MangeSubscriberPackagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MangeSubscriberPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
