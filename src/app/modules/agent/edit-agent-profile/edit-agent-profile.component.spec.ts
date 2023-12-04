import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAgentProfileComponent } from './edit-agent-profile.component';

describe('EditAgentProfileComponent', () => {
  let component: EditAgentProfileComponent;
  let fixture: ComponentFixture<EditAgentProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAgentProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAgentProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
