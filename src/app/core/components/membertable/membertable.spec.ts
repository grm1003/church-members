import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Membertable } from './membertable';

describe('Membertable', () => {
  let component: Membertable;
  let fixture: ComponentFixture<Membertable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Membertable],
    }).compileComponents();

    fixture = TestBed.createComponent(Membertable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
