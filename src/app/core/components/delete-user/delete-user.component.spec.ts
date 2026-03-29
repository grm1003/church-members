import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteUser } from './delete-user.component';

describe('DeleteUser', () => {
  let component: DeleteUser;
  let fixture: ComponentFixture<DeleteUser>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteUser],
    }).compileComponents();
    fixture = TestBed.createComponent(DeleteUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
