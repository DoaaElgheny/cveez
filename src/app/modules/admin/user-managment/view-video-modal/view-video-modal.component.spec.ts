import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVideoModalComponent } from './view-video-modal.component';

describe('ViewVideoModalComponent', () => {
  let component: ViewVideoModalComponent;
  let fixture: ComponentFixture<ViewVideoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewVideoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewVideoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
