import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMangeClassificationComponent } from './modal-mange-classification.component';

describe('ModalMangeClassificationComponent', () => {
  let component: ModalMangeClassificationComponent;
  let fixture: ComponentFixture<ModalMangeClassificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMangeClassificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalMangeClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
