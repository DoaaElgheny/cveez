import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditJobSeekerComponent } from './edit-job-seeker.component';

describe('EditJobSeekerComponent', () => {
  let component: EditJobSeekerComponent;
  let fixture: ComponentFixture<EditJobSeekerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditJobSeekerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditJobSeekerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
