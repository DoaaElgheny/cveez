import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneSuccessfullyComponent } from './done-successfully.component';

describe('DoneSuccessfullyComponent', () => {
  let component: DoneSuccessfullyComponent;
  let fixture: ComponentFixture<DoneSuccessfullyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoneSuccessfullyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoneSuccessfullyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
