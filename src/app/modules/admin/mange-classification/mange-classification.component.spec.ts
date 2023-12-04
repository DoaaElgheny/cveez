import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangeClassificationComponent } from './mange-classification.component';

describe('MangeClassificationComponent', () => {
  let component: MangeClassificationComponent;
  let fixture: ComponentFixture<MangeClassificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MangeClassificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MangeClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
