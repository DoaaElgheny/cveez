import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapJobComponent } from './snap-job.component';

describe('SnapJobComponent', () => {
  let component: SnapJobComponent;
  let fixture: ComponentFixture<SnapJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnapJobComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnapJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
