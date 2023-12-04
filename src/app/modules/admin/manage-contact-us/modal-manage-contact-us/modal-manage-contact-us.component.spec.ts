import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalManageContactUsComponent } from './modal-manage-contact-us.component';

describe('ModalManageContactUsComponent', () => {
  let component: ModalManageContactUsComponent;
  let fixture: ComponentFixture<ModalManageContactUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalManageContactUsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalManageContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
