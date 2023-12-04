import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTitlesComponent } from './edit-titles.component';

describe('EditTitlesComponent', () => {
  let component: EditTitlesComponent;
  let fixture: ComponentFixture<EditTitlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTitlesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTitlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
