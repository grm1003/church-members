import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { GetMembers } from '../../services/get-members';

@Component({
  selector: 'app-delete-user',
  imports: [ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule],
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.css',
})
export class DeleteUser {
  private fb = inject(FormBuilder);
  private membersService = inject(GetMembers);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  validateForm = this.fb.group({
    nome: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)])
  });

  // Mensagens automaticas para erros de validacao.
  autoTips: Record<string, Record<string, string>> = {
    'pt-br': {
      required: 'Campo obrigatorio',
    },
    default: {
      required: 'Campo obrigatorio',
    },
  };

  constructor() {
    const nomeParam = this.route.snapshot.queryParamMap.get('nome')?.trim();

    if (nomeParam) {
      this.validateForm.patchValue({ nome: nomeParam });
    }
  }

  submitForm(): void {
    if (this.validateForm.invalid) {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const formValue = this.validateForm.getRawValue();
    const nome = formValue.nome.trim();

    const confirmed = window.confirm(
      `Tem certeza que deseja remover o membro "${nome}"? Ele sera removido da lista e desvinculado da familia dos outros membros.`
    );
    if (!confirmed) {
      return;
    }

    const removed = this.membersService.removeMemberByName(nome);

    if (!removed) {
      console.warn(`Nenhum membro encontrado com o nome: ${nome}`);
      return;
    }

    console.log(`Membro removido: ${nome}`);
    this.validateForm.reset();
    this.router.navigateByUrl('/home');
  }
}
