import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Member } from '../../models/Member';
import { DataPicker } from "../data-picker/data-picker";
import { NzDividerModule } from 'ng-zorro-antd/divider';

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<Member> | null;
  sortDirections: NzTableSortOrder[];
}

@Component({
  selector: 'app-member-table',
  imports: [CommonModule, RouterLink, DataPicker, NzTableModule, NzButtonModule, NzIconModule, NzDividerModule, NzModalModule],
  standalone: true,
  templateUrl: './membertable.html',
  styleUrl: './membertable.css',
})
export class Membertable {
  @Input() tableName: string = 'Tabela';
  @Input() tableData: Member[] = [];

  isLoading = false;
  isFamilyModalVisible = false;
  familyModalTitle = 'Familia do membro';
  selectedFamily: string[] = [];
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
    sortFn: (a: Member, b: Member) => a.email.localeCompare(b.email),
    sortDirections: ['ascend', 'descend', null],
  };

  readonly aniversarioColumn: ColumnItem = {
    name: 'Aniversario',
    sortOrder: null,
    sortFn: (a: Member, b: Member) => this.compareBirthdayByReference(a.aniversario, b.aniversario),
    sortDirections: ['ascend', 'descend', null],
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData']) {
      this.applyBirthdayFilter();
    }
  }

  onDateSelected(date: Date): void {
    this.selectedDate = date;
    this.applyBirthdayFilter();
    this.nomeColumn.sortOrder = null;
    this.emailColumn.sortOrder = null;
    this.aniversarioColumn.sortOrder = 'ascend';
  }

  private applyBirthdayFilter(): void {
    if (!this.selectedDate) {
      this.filteredData = [...this.tableData];
      return;
    }

    // Mantem todos os registros e ordena pela proxima ocorrencia de aniversario
    // considerando apenas dia/mes a partir da data selecionada.
    this.filteredData = [...this.tableData].sort((a, b) => {
      const distanceA = this.getDistanceFromReference(a.aniversario);
      const distanceB = this.getDistanceFromReference(b.aniversario);

      if (distanceA !== distanceB) {
        return distanceA - distanceB;
      }

      return this.getBirthdaySortKey(a.aniversario) - this.getBirthdaySortKey(b.aniversario);
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

  constructor() {
    this.filteredData = [...this.tableData];
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

  openFamilyModal(member: Member): void {
    this.familyModalTitle = `Familia de ${member.nome}`;
    this.selectedFamily = [...member.familia];
    this.isFamilyModalVisible = true;
  }

  closeFamilyModal(): void {
    this.isFamilyModalVisible = false;
  }
}
