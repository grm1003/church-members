import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Familia, MemberSaveDto, RelacaoDto, RelacaoFamilia, RelacaoFamiliaOption } from '../../models/Member';
import { FamiliasApiService } from '../../services/familias-api.service';
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
  private familiasService = inject(FamiliasApiService);
  private router = inject(Router);

  validateForm = this.fb.group({
    nome: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    aniversario: this.fb.control<Date | null>(null, [Validators.required]),
    familiasRelacao: this.fb.array([this.createFamiliaRelacaoGroup()]),
  });

  familyOptions: Familia[] = [];
  relationOptions: RelacaoFamiliaOption[] = [];

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

  get familiaRelacaoControls() {
    return this.validateForm.controls.familiasRelacao.controls;
  }

  constructor() {
    this.familiasService.listFamilias().subscribe({
      next: (familias) => {
        this.familyOptions = familias;
      },
      error: (error: unknown) => console.warn('Erro ao carregar familias:', error),
    });

    this.familiasService.listRelacoes().subscribe({
      next: (relacoes) => {
        this.relationOptions = relacoes;
      },
      error: (error: unknown) => console.warn('Erro ao carregar relacoes:', error),
    });
  }

  submitForm(): void {
    if (this.validateForm.invalid) {
      this.markControlsAsDirty();
      return;
    }

    const formValue = this.validateForm.getRawValue();
    const familiasRelacao: RelacaoDto[] = (formValue.familiasRelacao ?? []).flatMap((relacao) => {
      if (relacao.familiaId === null) {
        return [];
      }

      return [
        {
          familiaId: relacao.familiaId,
          tipoRelacao: relacao.tipoRelacao,
        },
      ];
    });

    const payload: MemberSaveDto = {
      nome: formValue.nome.trim(),
      email: formValue.email.trim(),
      data: this.formatDate(formValue.aniversario as Date),
      tipoRelacao: familiasRelacao,
    };

    this.membersService.addMember(payload);
    console.log('Membro cadastrado:', payload);
    this.validateForm.reset();
    this.validateForm.setControl('familiasRelacao', this.fb.array([this.createFamiliaRelacaoGroup()]));
    this.router.navigateByUrl('/home');
  }

  addFamiliaRelacao(): void {
    this.validateForm.controls.familiasRelacao.push(this.createFamiliaRelacaoGroup());
  }

  removeFamiliaRelacao(index: number): void {
    if (this.validateForm.controls.familiasRelacao.length === 1) {
      this.validateForm.controls.familiasRelacao.at(0).reset({ familiaId: null, tipoRelacao: 'OUTRO' });
      return;
    }

    this.validateForm.controls.familiasRelacao.removeAt(index);
  }

  isFamilySelected(familyId: number, currentIndex: number): boolean {
    return this.validateForm.controls.familiasRelacao.controls.some((control, index) => {
      if (index === currentIndex) {
        return false;
      }

      return control.get('familiaId')?.value === familyId;
    });
  }

  private createFamiliaRelacaoGroup() {
    return this.fb.group({
      familiaId: this.fb.control<number | null>(null, [Validators.required]),
      tipoRelacao: this.fb.nonNullable.control<RelacaoFamilia>('OUTRO', [Validators.required]),
    });
  }

  private markControlsAsDirty(): void {
    Object.values(this.validateForm.controls).forEach((control) => {
      if ('controls' in control && Array.isArray(control.controls)) {
        control.controls.forEach((nestedControl) => {
          if ('controls' in nestedControl && Array.isArray(nestedControl.controls)) {
            nestedControl.controls.forEach((deepControl) => {
              deepControl.markAsDirty();
              deepControl.updateValueAndValidity({ onlySelf: true });
            });
            return;
          }

          nestedControl.markAsDirty();
          nestedControl.updateValueAndValidity({ onlySelf: true });
        });
        return;
      }

      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
