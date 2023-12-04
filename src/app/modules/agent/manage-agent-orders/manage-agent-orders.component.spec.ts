import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAgentOrdersComponent } from './manage-agent-orders.component';

describe('ManageAgentOrdersComponent', () => {
  let component: ManageAgentOrdersComponent;
  let fixture: ComponentFixture<ManageAgentOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAgentOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAgentOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
