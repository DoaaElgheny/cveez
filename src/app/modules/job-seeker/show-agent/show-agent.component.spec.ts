import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAgentComponent } from './show-agent.component';

describe('ShowAgentComponent', () => {
  let component: ShowAgentComponent;
  let fixture: ComponentFixture<ShowAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAgentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
