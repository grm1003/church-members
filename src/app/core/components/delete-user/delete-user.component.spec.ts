import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { icons } from '../../../icons-provider';
import { DeleteUser } from './delete-user.component';

describe('DeleteUser', () => {
  let component: DeleteUser;
  let fixture: ComponentFixture<DeleteUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteUser],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideNzIcons(icons),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DeleteUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});

