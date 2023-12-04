import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentDetailComponent } from './agent-detail.component';

describe('MembersComponent', () => {
  let component: AgentDetailComponent;
  let fixture: ComponentFixture<AgentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgentDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
