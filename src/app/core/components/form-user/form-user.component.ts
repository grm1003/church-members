import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Member } from '../../models/Member';
import { GetMembers } from '../../services/get-members';

@Component({
  selector: 'app-form-user',
  imports: [ReactiveFormsModule, NzButtonModule, NzDatePickerModule, NzFormModule, NzInputModule, NzSelectModule],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.css',
})
export class FormUser {
  private fb = inject(FormBuilder);
  private membersService = inject(GetMembers);
  private router = inject(Router);

  validateForm = this.fb.group({
    nome: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    aniversario: this.fb.control<Date | null>(null, [Validators.required]),
    familia: this.fb.nonNullable.control<string[]>([]),
  });

  familyOptions: string[] = [];

  // Mensagens automaticas para erros de validacao.
  autoTips: Record<string, Record<string, string>> = {
    'pt-br': {
      required: 'Campo obrigatorio',
      email: 'E-mail invalido',
    },
    default: {
      required: 'Campo obrigatorio',
      email: 'E-mail invalido',
    },
  };

  readonly disableFutureDates = (current: Date): boolean => current.getTime() > Date.now();

  constructor() {
    this.familyOptions = this.membersService.getMembers().map((member) => member.nome);
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
    const normalizedFamily = (formValue.familia ?? [])
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    const payload: Member = {
      nome: formValue.nome.trim(),
      email: formValue.email.trim(),
      aniversario: this.formatDate(formValue.aniversario as Date),
      familia: normalizedFamily,
    };

    this.membersService.addMember(payload);
    console.log('Membro cadastrado:', payload);
    this.validateForm.reset();
    this.router.navigateByUrl('/home');
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
