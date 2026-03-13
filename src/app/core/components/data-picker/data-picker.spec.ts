import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPicker } from './data-picker';

describe('DataPicker', () => {
  let component: DataPicker;
  let fixture: ComponentFixture<DataPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataPicker],
    }).compileComponents();

    fixture = TestBed.createComponent(DataPicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
