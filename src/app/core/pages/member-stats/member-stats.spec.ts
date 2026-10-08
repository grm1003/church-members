import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { of } from 'rxjs';
import { icons } from '../../../icons-provider';
import { MembersApiService } from '../../services/members-api.service';
import { MemberStats } from './member-stats';

describe('MemberStatsComponent', () => {
  let component: MemberStats;
  let fixture: ComponentFixture<MemberStats>;
  let membersApiService: MembersApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberStats],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideNzIcons(icons),
      ],
    }).compileComponents();

    membersApiService = TestBed.inject(MembersApiService);
    vi.spyOn(membersApiService, 'getEstatisticas').mockReturnValue(
      of({ total: 10, totalMasculino: 6, totalFeminino: 4 })
    );
    vi.spyOn(membersApiService, 'filtrarMembros').mockReturnValue(
      of({
        total: 2,
        membros: [
          { id: 1, nome: 'Lucas', genero: 'MASCULINO', dataNascimento: '2000-01-01', idade: 26 },
          { id: 2, nome: 'Maria', genero: 'FEMININO', dataNascimento: '2002-05-10', idade: 24 },
        ],
      })
    );

    fixture = TestBed.createComponent(MemberStats);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should compile and load stats and members', () => {
    expect(component).toBeTruthy();
    expect(component.stats.total).toBe(10);
    expect(component.stats.totalMasculino).toBe(6);
    expect(component.stats.totalFeminino).toBe(4);
    expect(component.filteredTotal).toBe(2);
    expect(component.membros.length).toBe(2);
  });

  it('should apply filters when calling aplicarFiltro()', () => {
    const filtrarSpy = vi.spyOn(membersApiService, 'filtrarMembros').mockReturnValue(
      of({ total: 1, membros: [{ id: 1, nome: 'Lucas', genero: 'MASCULINO', dataNascimento: '2000-01-01', idade: 26 }] })
    );

    component.generoFilter = 'MASCULINO';
    component.minIdade = 20;
    component.maxIdade = 30;

    component.aplicarFiltro();

    expect(filtrarSpy).toHaveBeenCalledWith('MASCULINO', 20, 30);
    expect(component.filteredTotal).toBe(1);
    expect(component.membros[0].nome).toBe('Lucas');
  });

  it('should reset filters when calling limparFiltros()', () => {
    const filtrarSpy = vi.spyOn(membersApiService, 'filtrarMembros').mockReturnValue(
      of({ total: 2, membros: [] })
    );

    component.generoFilter = 'FEMININO';
    component.minIdade = 15;
    component.maxIdade = 40;

    component.limparFiltros();

    expect(component.generoFilter).toBe('TODOS');
    expect(component.minIdade).toBeNull();
    expect(component.maxIdade).toBeNull();
    expect(filtrarSpy).toHaveBeenCalledWith('TODOS', null, null);
  });
});
