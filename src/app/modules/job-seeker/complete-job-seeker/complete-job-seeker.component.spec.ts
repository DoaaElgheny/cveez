import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteJobSeekerComponent } from './complete-job-seeker.component';

describe('CompleteJobSeekerComponent', () => {
  let component: CompleteJobSeekerComponent;
  let fixture: ComponentFixture<CompleteJobSeekerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteJobSeekerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteJobSeekerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
