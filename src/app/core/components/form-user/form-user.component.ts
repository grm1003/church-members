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
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzRadioModule } from 'ng-zorro-antd/radio';
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
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzDatePickerModule,
    NzFormModule,
    NzInputModule,
    NzRadioModule,
    NzSelectModule,
    NzIconModule,
    NzDividerModule,
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
    genero: this.fb.control<Member['genero'] | null>(null, [Validators.required]),
    aniversario: this.fb.control<Date | null>(null, [Validators.required]),
    celular: this.fb.control<string>(''),
    estadoCivil: this.fb.control<string>(''),
    endereco: this.fb.control<string>(''),
    numero: this.fb.control<string>(''),
    bairro: this.fb.control<string>(''),
    filiacao: this.fb.control<string>(''),
    conjuge: this.fb.control<string>(''),
    recebidoPor: this.fb.control<string>(''),
    dataRecebimento: this.fb.control<Date | null>(null),
    meioRecepcao: this.fb.control<string>(''),
    familiaId: this.fb.nonNullable.control<number[]>([]),
    tipoRelacao: this.fb.nonNullable.control<Member['tipoRelacao']>('FILIADO'),
  });

  familyOptions: Familia[] = [];
  relationOptions: RelacaoFamiliaOption[] = [];
  isSubmitting = false;

  autoTips: Record<string, Record<string, string>> = {
    'pt-br': {
      required: 'Campo obrigatório',
      email: 'E-mail inválido',
    },
    default: {
      required: 'Campo obrigatório',
      email: 'E-mail inválido',
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
        console.warn('Erro ao carregar famílias:', error);
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
        console.warn('Erro ao carregar relações:', error);
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
    const tipoRelacao = formValue.tipoRelacao || 'FILIADO';

    const relacoesList = familiaIds.map((id) => ({
      familiaId: id,
      tipoRelacao,
    }));

    const emailVal = formValue.email?.trim() || '';
    const payload: MemberSaveDto = {
      nome: formValue.nome.trim(),
      email: emailVal.length > 0 ? emailVal : undefined,
      genero: formValue.genero as NonNullable<Member['genero']>,
      data: this.formatDate(formValue.aniversario as Date),
      celular: formValue.celular?.trim() || undefined,
      estadoCivil: formValue.estadoCivil?.trim() || undefined,
      endereco: formValue.endereco?.trim() || undefined,
      numero: formValue.numero?.trim() || undefined,
      bairro: formValue.bairro?.trim() || undefined,
      filiacao: formValue.filiacao?.trim() || undefined,
      conjuge: formValue.conjuge?.trim() || undefined,
      recebidoPor: formValue.recebidoPor?.trim() || undefined,
      dataRecebimento: formValue.dataRecebimento ? this.formatDate(formValue.dataRecebimento) : undefined,
      meioRecepcao: formValue.meioRecepcao?.trim() || undefined,
      tipoRelacao: relacoesList,
    };

    this.isSubmitting = true;
    this.cdr.markForCheck();

    this.membersService.addMember(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.message.success(`Membro "${payload.nome}" cadastrado com sucesso!`);
        this.validateForm.reset();
        this.validateForm.patchValue({ tipoRelacao: 'FILIADO', familiaId: [], genero: null });
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
