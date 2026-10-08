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
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { Familia, Member, MemberSaveDto, RelacaoDto, RelacaoFamilia, RelacaoFamiliaOption } from '../../models/Member';
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
    NzRadioModule,
    NzSelectModule,
    NzSwitchModule,
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
    genero: this.fb.control<Member['genero'] | null>(null, [Validators.required]),
    aniversario: this.fb.control<Date | null>(null, [Validators.required]),
    criarFamiliaAutomatica: this.fb.nonNullable.control<boolean>(false),
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

    this.validateForm.controls.criarFamiliaAutomatica.valueChanges.subscribe((ativar) => {
      const familiaControl = this.validateForm.controls.familiaId;
      if (ativar) {
        familiaControl.setValue([]);
        familiaControl.disable();
      } else {
        familiaControl.enable();
      }
      this.cdr.markForCheck();
    });
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
    const nomeMembro = formValue.nome.trim();

    this.isSubmitting = true;
    this.cdr.markForCheck();

    if (formValue.criarFamiliaAutomatica) {
      const nomeFamilia = `Família ${nomeMembro}`;
      this.familiasService.createFamilia({ nome: nomeFamilia }).subscribe({
        next: (novaFamilia) => {
          this.salvarMembroFinal(formValue, [{
            familiaId: novaFamilia.id,
            tipoRelacao: (formValue.tipoRelacao as RelacaoFamilia) || 'OUTRO',
          }]);
        },
        error: (err: any) => {
          this.isSubmitting = false;
          const msg = err?.error?.message || 'Erro ao criar família automática para o membro.';
          this.message.error(msg);
          this.cdr.markForCheck();
          console.error('Erro ao criar família automática:', err);
        },
      });
      return;
    }

    const familiaIds: number[] = formValue.familiaId ?? [];
    const tipoRelacao = (formValue.tipoRelacao as RelacaoFamilia) || 'OUTRO';
    const relacoesList: RelacaoDto[] = familiaIds.map((id) => ({
      familiaId: id,
      tipoRelacao,
    }));

    this.salvarMembroFinal(formValue, relacoesList);
  }

  private salvarMembroFinal(
    formValue: ReturnType<typeof this.validateForm.getRawValue>,
    relacoesList: RelacaoDto[]
  ): void {
    const emailVal = formValue.email?.trim() || '';
    const payload: MemberSaveDto = {
      nome: formValue.nome.trim(),
      email: emailVal.length > 0 ? emailVal : undefined,
      genero: formValue.genero as NonNullable<Member['genero']>,
      data: this.formatDate(formValue.aniversario as Date),
      tipoRelacao: relacoesList,
    };

    this.membersService.addMember(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.message.success(`Membro "${payload.nome}" cadastrado com sucesso!`);
        this.validateForm.reset();
        this.validateForm.patchValue({
          tipoRelacao: 'OUTRO',
          familiaId: [],
          genero: null,
          criarFamiliaAutomatica: false,
        });
        this.validateForm.controls.familiaId.enable();
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

