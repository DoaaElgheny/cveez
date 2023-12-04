import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOpportunityComponent } from './manage-opportunity.component';

describe('ManageOpportunityComponent', () => {
  let component: ManageOpportunityComponent;
  let fixture: ComponentFixture<ManageOpportunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOpportunityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
