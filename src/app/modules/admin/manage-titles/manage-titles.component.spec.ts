import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTitlesComponent } from './manage-titles.component';

describe('ManageTitlesComponent', () => {
  let component: ManageTitlesComponent;
  let fixture: ComponentFixture<ManageTitlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageTitlesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageTitlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
