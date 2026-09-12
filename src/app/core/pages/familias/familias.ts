import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Familia, MemberRelacao } from '../../models/Member';
import { FamiliasApiService } from '../../services/familias-api.service';

@Component({
  selector: 'app-familias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NzInputModule,
    NzButtonModule,
    NzTableModule,
    NzModalModule,
    NzPopconfirmModule,
    NzCardModule,
    NzIconModule,
    NzTagModule,
    NzAlertModule,
    NzSpinModule,
    NzDividerModule,
  ],
  templateUrl: './familias.html',
  styleUrl: './familias.css',
})
export class Familias implements OnInit {
  private readonly familiasService = inject(FamiliasApiService);
  private readonly message = inject(NzMessageService);
  private readonly cdr = inject(ChangeDetectorRef);

  familias: Familia[] = [];
  filteredFamilias: Familia[] = [];
  searchTerm = '';
  isLoading = false;

  // Modal de Membros da Família
  isMembersModalVisible = false;
  selectedFamilia: Familia | null = null;
  familiaMembers: MemberRelacao[] = [];
  isLoadingMembers = false;

  ngOnInit(): void {
    this.loadFamilias();
  }

  loadFamilias(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.familiasService.listFamilias().pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (data) => {
        this.familias = data;
        this.applyFilter();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.message.error('Erro ao carregar lista de famílias.');
        this.cdr.markForCheck();
        console.error(err);
      },
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredFamilias = [...this.familias];
    } else {
      this.filteredFamilias = this.familias.filter((f) =>
        f.nome.toLowerCase().includes(term)
      );
    }
  }

  viewMembers(familia: Familia): void {
    this.selectedFamilia = familia;
    this.isMembersModalVisible = true;
    this.isLoadingMembers = true;
    this.familiaMembers = [];
    this.cdr.markForCheck();

    this.familiasService.listFamiliaMembers(familia.id).pipe(
      finalize(() => {
        this.isLoadingMembers = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (members) => {
        this.familiaMembers = members;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.message.error(`Erro ao carregar membros da família ${familia.nome}.`);
        this.cdr.markForCheck();
        console.error(err);
      },
    });
  }

  closeMembersModal(): void {
    this.isMembersModalVisible = false;
    this.selectedFamilia = null;
    this.familiaMembers = [];
    this.isLoadingMembers = false;
    this.cdr.markForCheck();
  }

  deleteFamilia(familia: Familia): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.familiasService.deleteFamilia(familia.id).pipe(
      finalize(() => {
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: () => {
        this.message.success(`Família "${familia.nome}" excluída com sucesso.`);
        this.loadFamilias();
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error(`Erro ao excluir família "${familia.nome}".`);
        this.cdr.markForCheck();
        console.error(err);
      },
    });
  }
}
