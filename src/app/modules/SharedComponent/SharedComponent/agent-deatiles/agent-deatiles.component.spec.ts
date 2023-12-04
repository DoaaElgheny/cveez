import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDeatilesComponent } from './agent-deatiles.component';

describe('AgentDeatilesComponent', () => {
  let component: AgentDeatilesComponent;
  let fixture: ComponentFixture<AgentDeatilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentDeatilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentDeatilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
