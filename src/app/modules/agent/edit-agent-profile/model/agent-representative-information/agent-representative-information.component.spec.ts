import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentRepresentativeInformationComponent } from './agent-representative-information.component';

describe('AgentRepresentativeInformationComponent', () => {
  let component: AgentRepresentativeInformationComponent;
  let fixture: ComponentFixture<AgentRepresentativeInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentRepresentativeInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentRepresentativeInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
