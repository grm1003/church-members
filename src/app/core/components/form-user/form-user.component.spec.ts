import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { provideNzI18n, pt_PT } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';
import { of } from 'rxjs';
import { icons } from '../../../icons-provider';
import { FamiliasApiService } from '../../services/familias-api.service';
import { GetMembers } from '../../services/get-members';
import { FormUser } from './form-user.component';

registerLocaleData(pt);

describe('FormUserComponent', () => {
  let component: FormUser;
  let fixture: ComponentFixture<FormUser>;
  let familiasService: FamiliasApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormUser],
      providers: [
        provideHttpClient(),
        provideRouter([{ path: 'home', component: FormUser }]),
        provideNzIcons(icons),
        provideNzI18n(pt_PT),
      ],
    }).compileComponents();

    familiasService = TestBed.inject(FamiliasApiService);
    vi.spyOn(familiasService, 'listFamilias').mockReturnValue(of([{ id: 1, nome: 'Família Teste' }]));
    vi.spyOn(familiasService, 'listRelacoes').mockReturnValue(of([{ valor: 'PAI', descricao: 'Pai' }]));

    fixture = TestBed.createComponent(FormUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should compile and load options', () => {
    expect(component).toBeTruthy();
    expect(component.familyOptions.length).toBe(1);
    expect(component.relationOptions.length).toBe(1);
  });

  it('should invalidate form when genero is not selected', () => {
    component.validateForm.setValue({
      nome: 'João Silva',
      email: 'joao@silva.com',
      genero: null,
      aniversario: new Date('1990-05-15T12:00:00Z'),
      familiaId: [1],
      tipoRelacao: 'PAI',
    });

    expect(component.validateForm.invalid).toBe(true);
    expect(component.validateForm.controls.genero.invalid).toBe(true);
  });

  it('should submit form with correct genero and payload', () => {
    const getMembersService = TestBed.inject(GetMembers);
    const addMemberSpy = vi.spyOn(getMembersService, 'addMember').mockReturnValue(of('OK'));

    component.validateForm.setValue({
      nome: 'João Silva',
      email: 'joao@silva.com',
      genero: 'MASCULINO',
      aniversario: new Date('1990-05-15T12:00:00Z'),
      familiaId: [1],
      tipoRelacao: 'PAI',
    });

    component.submitForm();

    expect(addMemberSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: 'João Silva',
        email: 'joao@silva.com',
        genero: 'MASCULINO',
        tipoRelacao: [{ familiaId: 1, tipoRelacao: 'PAI' }],
      })
    );
  });
});
