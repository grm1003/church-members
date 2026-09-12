import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { icons } from '../../../icons-provider';
import { CsvModalComponent } from './csv-modal.component';

describe('CsvModalComponent', () => {
  let component: CsvModalComponent;
  let fixture: ComponentFixture<CsvModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsvModalComponent],
      providers: [
        provideHttpClient(),
        provideNzIcons(icons),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CsvModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate non-csv file on beforeUpload', () => {
    const fakeFile = { name: 'test.pdf' } as any;
    const result = component.beforeUpload(fakeFile);
    expect(result).toBe(false);
    expect(component.selectedFile).toBeNull();
  });

  it('should accept csv file on beforeUpload', () => {
    const fakeFile = { name: 'members.csv' } as any;
    const result = component.beforeUpload(fakeFile);
    expect(result).toBe(false);
    expect(component.selectedFile).toBe(fakeFile);
    expect(component.fileList.length).toBe(1);
  });

  it('should clear selection on handleRemove', () => {
    component.selectedFile = { name: 'members.csv' } as any;
    component.fileList = [{ name: 'members.csv' } as any];
    component.handleRemove();
    expect(component.selectedFile).toBeNull();
    expect(component.fileList.length).toBe(0);
  });
});
