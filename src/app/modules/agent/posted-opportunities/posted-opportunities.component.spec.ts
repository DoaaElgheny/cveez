import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostedOpportunitiesComponent } from './posted-opportunities.component';

describe('PostedOpportunitiesComponent', () => {
  let component: PostedOpportunitiesComponent;
  let fixture: ComponentFixture<PostedOpportunitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostedOpportunitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostedOpportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
