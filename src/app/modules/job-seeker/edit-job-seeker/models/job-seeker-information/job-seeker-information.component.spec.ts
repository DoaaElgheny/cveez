import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSeekerInformationComponent } from './job-seeker-information.component';

describe('JobSeekerInformationComponent', () => {
  let component: JobSeekerInformationComponent;
  let fixture: ComponentFixture<JobSeekerInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobSeekerInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobSeekerInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
