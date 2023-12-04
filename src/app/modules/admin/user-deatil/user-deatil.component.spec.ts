import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDeatilComponent } from './user-deatil.component';

describe('MembersComponent', () => {
  let component: UserDeatilComponent;
  let fixture: ComponentFixture<UserDeatilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDeatilComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDeatilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
