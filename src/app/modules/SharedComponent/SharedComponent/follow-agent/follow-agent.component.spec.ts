import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowAgentComponent } from './follow-agent.component';

describe('FollowAgentComponent', () => {
  let component: FollowAgentComponent;
  let fixture: ComponentFixture<FollowAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowAgentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
