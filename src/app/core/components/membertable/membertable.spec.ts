import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { icons } from '../../../icons-provider';
import { Membertable } from './membertable';

describe('Membertable', () => {
  let component: Membertable;
  let fixture: ComponentFixture<Membertable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Membertable],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideNzIcons(icons),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Membertable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle csv modal visibility', () => {
    expect(component.isCsvModalVisible).toBe(false);
    component.openCsvModal();
    expect(component.isCsvModalVisible).toBe(true);
    component.closeCsvModal();
    expect(component.isCsvModalVisible).toBe(false);
  });
});

