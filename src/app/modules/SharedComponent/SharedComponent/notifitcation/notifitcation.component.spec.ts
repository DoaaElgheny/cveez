import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifitcationComponent } from './notifitcation.component';

describe('NotifitcationComponent', () => {
  let component: NotifitcationComponent;
  let fixture: ComponentFixture<NotifitcationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifitcationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotifitcationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
