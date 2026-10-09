import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { catchError, finalize, forkJoin, map, of } from 'rxjs';
import { Familia, Member, MemberRelacao } from '../../models/Member';
import { FamiliasApiService } from '../../services/familias-api.service';
import { GetMembers } from '../../services/get-members';
import { MembersApiService } from '../../services/members-api.service';
import { CsvModalComponent } from '../csv-modal/csv-modal.component';
import { DataPicker } from '../data-picker/data-picker';

export interface MemberFamilyGroup {
  familiaId: number;
  nomeFamilia: string;
  membros: MemberRelacao[];
}

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<Member> | null;
  sortDirections: NzTableSortOrder[];
}

@Component({
  selector: 'app-member-table',
  imports: [
    CommonModule,
    DataPicker,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
    NzModalModule,
    NzTagModule,
    NzSpinModule,
    NzPopconfirmModule,
    CsvModalComponent,
  ],
  standalone: true,
  templateUrl: './membertable.html',
  styleUrl: './membertable.css',
})
export class Membertable implements OnChanges {
  @Input() tableName: string = 'Tabela';
  @Input() tableData: Member[] = [];
  @Input() isLoading: boolean = false;

  private readonly membersApiService = inject(MembersApiService);
  private readonly familiasService = inject(FamiliasApiService);
  private readonly getMembersService = inject(GetMembers);
  private readonly message = inject(NzMessageService);
  private readonly cdr = inject(ChangeDetectorRef);

  isFamilyModalVisible = false;
  isFichaModalVisible = false;
  isCsvModalVisible = false;
  isExportingExcel = false;
  familyModalTitle = 'Família do membro';
  currentSelectedMember: Member | null = null;
  selectedFichaMember: Member | null = null;
  familyGroups: MemberFamilyGroup[] = [];
  isLoadingFamilyMembers = false;
  selectedDate: Date | null = null;
  filteredData: Member[] = [];

  readonly nomeColumn: ColumnItem = {
    name: 'Nome',
    sortOrder: null,
    sortFn: (a: Member, b: Member) => a.nome.localeCompare(b.nome),
    sortDirections: ['ascend', 'descend', null],
  };

  readonly emailColumn: ColumnItem = {
    name: 'Email',
    sortOrder: null,
    sortFn: (a: Member, b: Member) => (a.email || '').localeCompare(b.email || ''),
    sortDirections: ['ascend', 'descend', null],
  };

  readonly aniversarioColumn: ColumnItem = {
    name: 'Aniversario',
    sortOrder: null,
    sortFn: (a: Member, b: Member) => this.compareBirthdayByReference(a.aniversario || a.data, b.aniversario || b.data),
    sortDirections: ['ascend', 'descend', null],
  };

  constructor() {
    this.filteredData = [...this.tableData];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData'] || changes['isLoading']) {
      this.applyBirthdayFilter();
      this.cdr.markForCheck();
    }
  }

  onDateSelected(date: Date): void {
    this.selectedDate = date;
    this.applyBirthdayFilter();
    this.nomeColumn.sortOrder = null;
    this.emailColumn.sortOrder = null;
    this.aniversarioColumn.sortOrder = 'ascend';
    this.cdr.markForCheck();
  }

  private applyBirthdayFilter(): void {
    if (!this.selectedDate) {
      this.filteredData = [...this.tableData];
      return;
    }

    this.filteredData = [...this.tableData].sort((a, b) => {
      const dateA = a.aniversario || a.data || '';
      const dateB = b.aniversario || b.data || '';
      const distanceA = this.getDistanceFromReference(dateA);
      const distanceB = this.getDistanceFromReference(dateB);

      if (distanceA !== distanceB) {
        return distanceA - distanceB;
      }

      return this.getBirthdaySortKey(dateA) - this.getBirthdaySortKey(dateB);
    });
  }

  private getDayMonth(dateValue: string): { day: number; month: number } {
    const [yearStr, monthStr, dayStr] = dateValue.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);

    if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
      return { day, month };
    }

    const parsed = new Date(dateValue);
    return { day: parsed.getDate(), month: parsed.getMonth() + 1 };
  }

  private getBirthdaySortKey(dateValue: string): number {
    const { day, month } = this.getDayMonth(dateValue);
    return month * 100 + day;
  }

  private getDistanceFromReference(dateValue: string): number {
    const { day, month } = this.getDayMonth(dateValue);
    const reference = this.selectedDate ?? new Date();

    const refDate = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate(), 12, 0, 0, 0);
    const nextBirthday = new Date(refDate.getFullYear(), month - 1, day, 12, 0, 0, 0);

    if (nextBirthday < refDate) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }

    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.round((nextBirthday.getTime() - refDate.getTime()) / msPerDay);
  }

  private compareBirthdayByReference(aDate: string, bDate: string): number {
    const distanceA = this.getDistanceFromReference(aDate);
    const distanceB = this.getDistanceFromReference(bDate);

    if (distanceA !== distanceB) {
      return distanceA - distanceB;
    }

    return this.getBirthdaySortKey(aDate) - this.getBirthdaySortKey(bDate);
  }

  clearDateFilter(): void {
    this.selectedDate = null;
    this.applyBirthdayFilter();
  }

  resetSort(): void {
    [this.nomeColumn, this.emailColumn, this.aniversarioColumn].forEach((col) => {
      col.sortOrder = null;
    });
  }

  resetFilters(): void {
    this.clearDateFilter();
    this.resetSort();
  }

  openFichaModal(member: Member): void {
    this.selectedFichaMember = member;
    this.isFichaModalVisible = true;
    this.cdr.markForCheck();
  }

  closeFichaModal(): void {
    this.isFichaModalVisible = false;
    this.selectedFichaMember = null;
    this.cdr.markForCheck();
  }

  openFamilyModal(member: Member): void {
    this.currentSelectedMember = member;
    this.familyModalTitle = `Família de ${member.nome}`;
    this.isFamilyModalVisible = true;
    this.isLoadingFamilyMembers = true;
    this.familyGroups = [];
    this.cdr.markForCheck();

    const relacoes = member.relacoes ?? [];
    const directIds = member.familiaId ?? [];

    const familyMap = new Map<number, string>();
    for (const r of relacoes) {
      if (r.familiaId) {
        familyMap.set(r.familiaId, r.nomeFamilia || `Família #${r.familiaId}`);
      }
    }
    for (let i = 0; i < directIds.length; i++) {
      const fid = directIds[i];
      if (!familyMap.has(fid)) {
        familyMap.set(fid, member.familia?.[i] || `Família #${fid}`);
      }
    }

    if (familyMap.size === 0 && member.id) {
      this.membersApiService.getMemberFamilies(member.id).pipe(
        finalize(() => {
          this.isLoadingFamilyMembers = false;
          this.cdr.markForCheck();
        })
      ).subscribe({
        next: (fams) => {
          if (!fams || fams.length === 0) {
            this.familyGroups = [];
            this.cdr.markForCheck();
            return;
          }
          this.fetchMembersForFamilies(fams);
        },
        error: () => {
          this.familyGroups = [];
          this.cdr.markForCheck();
        },
      });
      return;
    }

    const famList = Array.from(familyMap.entries()).map(([id, nome]) => ({ id, nome }));
    this.fetchMembersForFamilies(famList);
  }

  private fetchMembersForFamilies(fams: { id: number; nome: string }[]): void {
    if (!fams || fams.length === 0) {
      this.familyGroups = [];
      this.isLoadingFamilyMembers = false;
      this.cdr.markForCheck();
      return;
    }

    const requests = fams.map((f) =>
      this.familiasService.listFamiliaMembers(f.id).pipe(
        map((membros) => ({
          familiaId: f.id,
          nomeFamilia: f.nome,
          membros,
        })),
        catchError(() =>
          of({
            familiaId: f.id,
            nomeFamilia: f.nome,
            membros: [],
          })
        )
      )
    );

    forkJoin(requests).pipe(
      finalize(() => {
        this.isLoadingFamilyMembers = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (groups) => {
        this.familyGroups = groups;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cdr.markForCheck();
      },
    });
  }

  closeFamilyModal(): void {
    this.isFamilyModalVisible = false;
    this.currentSelectedMember = null;
    this.familyGroups = [];
    this.isLoadingFamilyMembers = false;
    this.cdr.markForCheck();
  }

  deleteMemberDirect(member: Member): void {
    if (!member.id) {
      this.message.error(`Membro "${member.nome}" não possui ID válido para exclusão.`);
      return;
    }

    this.getMembersService.deleteMember(member.id).pipe(
      finalize(() => {
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: () => {
        this.message.success(`Membro "${member.nome}" (ID: ${member.id}) removido com sucesso.`);
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.message.error(err?.error?.message || err?.message || `Erro ao remover membro "${member.nome}".`);
        this.cdr.markForCheck();
      },
    });
  }

  openCsvModal(): void {
    this.isCsvModalVisible = true;
  }

  closeCsvModal(): void {
    this.isCsvModalVisible = false;
  }

  exportExcel(): void {
    this.isExportingExcel = true;
    this.cdr.markForCheck();
    this.membersApiService.exportMembersExcel().pipe(
      finalize(() => {
        this.isExportingExcel = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'membros.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.message.success('Planilha Excel de membros exportada com sucesso!');
      },
      error: (error) => {
        this.message.error('Erro ao exportar membros para Excel.');
        console.error(error);
      },
    });
  }
}
