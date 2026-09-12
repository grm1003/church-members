import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalFamilyComponent } from './modal-family.component';

describe('ModalFamilyComponent', () => {
  let component: ModalFamilyComponent;
  let fixture: ComponentFixture<ModalFamilyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFamilyComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ModalFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});

