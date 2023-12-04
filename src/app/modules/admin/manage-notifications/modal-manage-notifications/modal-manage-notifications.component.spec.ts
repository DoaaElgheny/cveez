import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalManageNotificationsComponent } from './modal-manage-notifications.component';

describe('ModalManageNotificationsComponent', () => {
  let component: ModalManageNotificationsComponent;
  let fixture: ComponentFixture<ModalManageNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalManageNotificationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalManageNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
