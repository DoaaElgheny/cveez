import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusVideoModalComponent } from './status-video-modal.component';

describe('StatusVideoModalComponent', () => {
  let component: StatusVideoModalComponent;
  let fixture: ComponentFixture<StatusVideoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusVideoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusVideoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
