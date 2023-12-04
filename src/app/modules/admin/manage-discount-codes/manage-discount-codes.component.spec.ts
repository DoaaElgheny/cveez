import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDiscountCodesComponent } from './manage-discount-codes.component';

describe('ManageDiscountCodesComponent', () => {
  let component: ManageDiscountCodesComponent;
  let fixture: ComponentFixture<ManageDiscountCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDiscountCodesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDiscountCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
