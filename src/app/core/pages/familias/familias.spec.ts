import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { of } from 'rxjs';
import { icons } from '../../../icons-provider';
import { Familias } from './familias';
import { FamiliasApiService } from '../../services/familias-api.service';

describe('Familias Component', () => {
  let component: Familias;
  let fixture: ComponentFixture<Familias>;
  let familiasService: FamiliasApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Familias],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideNzIcons(icons),
      ],
    }).compileComponents();

    familiasService = TestBed.inject(FamiliasApiService);
    vi.spyOn(familiasService, 'listFamilias').mockReturnValue(of([]));
    fixture = TestBed.createComponent(Familias);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter familias by search term', () => {
    component.familias = [
      { id: 1, nome: 'Família Silva' },
      { id: 2, nome: 'Família Oliveira' },
      { id: 3, nome: 'Família Santos' },
    ];

    component.searchTerm = 'silva';
    component.applyFilter();
    expect(component.filteredFamilias.length).toBe(1);
    expect(component.filteredFamilias[0].nome).toBe('Família Silva');

    component.searchTerm = '';
    component.applyFilter();
    expect(component.filteredFamilias.length).toBe(3);
  });

  it('should open and close members modal', () => {
    const fakeFamilia = { id: 10, nome: 'Família Souza' };
    vi.spyOn(familiasService, 'listFamiliaMembers').mockReturnValue(
      of([
        {
          familiaId: 10,
          nomeMembro: 'Carlos Souza',
          emailMembro: 'carlos@souza.com',
          tipoRelacao: 'PAI',
        },
      ])
    );

    component.viewMembers(fakeFamilia);
    expect(component.isMembersModalVisible).toBe(true);
    expect(component.selectedFamilia).toEqual(fakeFamilia);
    expect(component.familiaMembers.length).toBe(1);

    component.closeMembersModal();
    expect(component.isMembersModalVisible).toBe(false);
    expect(component.selectedFamilia).toBeNull();
    expect(component.familiaMembers.length).toBe(0);
  });
});
