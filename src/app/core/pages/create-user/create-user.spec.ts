import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { icons } from '../../../icons-provider';
import { CreateUser } from './create-user';

describe('CreateUser', () => {
  let component: CreateUser;
  let fixture: ComponentFixture<CreateUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUser],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideNzIcons(icons),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

