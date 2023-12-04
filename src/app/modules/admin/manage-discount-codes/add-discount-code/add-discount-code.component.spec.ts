import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiscountCodeComponent } from './add-discount-code.component';

describe('AddDiscountCodeComponent', () => {
  let component: AddDiscountCodeComponent;
  let fixture: ComponentFixture<AddDiscountCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDiscountCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDiscountCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
