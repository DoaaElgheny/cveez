import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSeekerRegistrationComponent } from './job-seeker-registration.component';

describe('JobSeekerRegistrationComponent', () => {
  let component: JobSeekerRegistrationComponent;
  let fixture: ComponentFixture<JobSeekerRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobSeekerRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobSeekerRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
