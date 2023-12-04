import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSeekerBackgroundInformationComponent } from './job-seeker-background-information.component';

describe('JobSeekerBackgroundInformationComponent', () => {
  let component: JobSeekerBackgroundInformationComponent;
  let fixture: ComponentFixture<JobSeekerBackgroundInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobSeekerBackgroundInformationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JobSeekerBackgroundInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
