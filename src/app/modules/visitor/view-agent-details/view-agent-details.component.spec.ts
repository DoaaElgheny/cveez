import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAgentDetailsComponent } from './view-agent-details.component';

describe('ViewAgentDetailsComponent', () => {
  let component: ViewAgentDetailsComponent;
  let fixture: ComponentFixture<ViewAgentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAgentDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAgentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
