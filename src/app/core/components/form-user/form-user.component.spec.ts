import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormUser } from './form-user.component';

describe('FormUserComponent', () => {
  let component: FormUser;
  let fixture: ComponentFixture<FormUser>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormUser],
    });

    await TestBed.compileComponents();
    fixture = TestBed.createComponent(FormUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
