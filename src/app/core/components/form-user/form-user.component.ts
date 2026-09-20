import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Familia, Member, MemberSaveDto, RelacaoFamiliaOption } from '../../models/Member';
import { FamiliasApiService } from '../../services/familias-api.service';
import { GetMembers } from '../../services/get-members';

function optionalEmailValidator(control: AbstractControl): ValidationErrors | null {
  const val = control.value;
  if (!val || (typeof val === 'string' && val.trim() === '')) {
    return null;
  }
  return Validators.email(control);
}

@Component({
  selector: 'app-form-user',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzDatePickerModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzIconModule,
  ],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.css',
})
export class FormUser implements OnInit {
  private fb = inject(FormBuilder);
  private membersService = inject(GetMembers);
  private familiasService = inject(FamiliasApiService);
  private message = inject(NzMessageService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  validateForm = this.fb.group({
    nome: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    email: this.fb.control<string | null>('', [optionalEmailValidator]),
    aniversario: this.fb.control<Date | null>(null, [Validators.required]),
    familiaId: this.fb.nonNullable.control<number[]>([]),
    tipoRelacao: this.fb.nonNullable.control<Member['tipoRelacao']>('OUTRO'),
  });

  familyOptions: Familia[] = [];
  relationOptions: RelacaoFamiliaOption[] = [];
  isSubmitting = false;

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

  ngOnInit(): void {
    this.loadFamilies();
    this.loadRelations();
  }

  loadFamilies(): void {
    this.familiasService.listFamilias().subscribe({
      next: (familias) => {
        this.familyOptions = familias;
        this.cdr.markForCheck();
      },
      error: (error: unknown) => {
        console.warn('Erro ao carregar familias:', error);
        this.cdr.markForCheck();
      },
    });
  }

  loadRelations(): void {
    this.familiasService.listRelacoes().subscribe({
      next: (relacoes) => {
        this.relationOptions = relacoes;
        this.cdr.markForCheck();
      },
      error: (error: unknown) => {
        console.warn('Erro ao carregar relacoes:', error);
        this.cdr.markForCheck();
      },
    });
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
    const familiaIds: number[] = formValue.familiaId ?? [];
    const tipoRelacao = formValue.tipoRelacao || 'OUTRO';

    const relacoesList = familiaIds.map((id) => ({
      familiaId: id,
      tipoRelacao,
    }));

    const emailVal = formValue.email?.trim() || '';
    const payload: MemberSaveDto = {
      nome: formValue.nome.trim(),
      email: emailVal.length > 0 ? emailVal : undefined,
      data: this.formatDate(formValue.aniversario as Date),
      tipoRelacao: relacoesList,
    };

    this.isSubmitting = true;
    this.cdr.markForCheck();

    this.membersService.addMember(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.message.success(`Membro "${payload.nome}" cadastrado com sucesso!`);
        this.validateForm.reset();
        this.validateForm.patchValue({ tipoRelacao: 'OUTRO', familiaId: [] });
        this.cdr.markForCheck();
        this.router.navigateByUrl('/home');
      },
      error: (error: any) => {
        this.isSubmitting = false;
        const msg = error?.error?.message
          || (Array.isArray(error?.error?.details) ? error.error.details.join(' ') : null)
          || 'Erro ao cadastrar membro. Verifique os dados e tente novamente.';
        this.message.error(msg);
        this.cdr.markForCheck();
        console.error('Erro ao cadastrar membro:', error);
      },
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

