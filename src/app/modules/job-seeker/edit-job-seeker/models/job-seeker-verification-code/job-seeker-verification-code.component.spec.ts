import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSeekerVerificationCodeComponent } from './job-seeker-verification-code.component';

describe('JobSeekerVerificationCodeComponent', () => {
  let component: JobSeekerVerificationCodeComponent;
  let fixture: ComponentFixture<JobSeekerVerificationCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobSeekerVerificationCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobSeekerVerificationCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
