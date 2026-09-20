import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Member } from '../../models/Member';
import { GetMembers } from '../../services/get-members';

@Component({
  selector: 'app-delete-user',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzAlertModule,
    NzTagModule,
    NzIconModule,
    NzPopconfirmModule,
    NzDividerModule,
  ],
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.css',
})
export class DeleteUser implements OnInit {
  private fb = inject(FormBuilder);
  private membersService = inject(GetMembers);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private message = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);

  searchControl = this.fb.nonNullable.control('');
  allMembers: Member[] = [];
  filteredMembers: Member[] = [];
  hasSearched = false;
  deletingId: number | null = null;

  ngOnInit(): void {
    this.membersService.members$.subscribe((members) => {
      this.allMembers = members;
      this.applyFilter();
    });

    const nomeParam = this.route.snapshot.queryParamMap.get('nome')?.trim();
    if (nomeParam) {
      this.searchControl.setValue(nomeParam);
      this.hasSearched = true;
      this.applyFilter();
    }

    this.searchControl.valueChanges.subscribe(() => {
      this.hasSearched = true;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    const term = this.searchControl.value.trim().toLowerCase();
    if (!term) {
      this.filteredMembers = [];
      this.cdr.markForCheck();
      return;
    }

    this.filteredMembers = this.allMembers.filter((m) => {
      const matchNome = m.nome.toLowerCase().includes(term);
      const matchEmail = m.email ? m.email.toLowerCase().includes(term) : false;
      const matchId = m.id ? String(m.id) === term : false;
      return matchNome || matchEmail || matchId;
    });

    this.cdr.markForCheck();
  }

  get hasHomonyms(): boolean {
    if (this.filteredMembers.length <= 1) return false;
    const names = this.filteredMembers.map((m) => m.nome.trim().toLowerCase());
    return new Set(names).size < names.length;
  }

  confirmDelete(member: Member): void {
    if (!member.id) {
      this.message.error(`Membro "${member.nome}" não possui ID para exclusão.`);
      return;
    }

    this.deletingId = member.id;
    this.cdr.markForCheck();

    this.membersService.deleteMember(member.id).subscribe({
      next: () => {
        this.deletingId = null;
        this.message.success(`Membro "${member.nome}" (ID: ${member.id}) excluído com sucesso.`);
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.deletingId = null;
        const msg = err?.error?.message || err?.message || `Erro ao remover membro "${member.nome}".`;
        this.message.error(msg);
        this.cdr.markForCheck();
      },
    });
  }

  voltar(): void {
    this.router.navigateByUrl('/home');
  }
}
