import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceDecissionComponent } from './acceptance-decision.component';

describe('AcceptanceDecissionComponent', () => {
  let component: AcceptanceDecissionComponent;
  let fixture: ComponentFixture<AcceptanceDecissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptanceDecissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptanceDecissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
