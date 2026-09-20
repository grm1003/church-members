import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FamiliasApiService } from '../../services/familias-api.service';

@Component({
  selector: 'app-create-familia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
  ],
  templateUrl: './create-familia.html',
  styleUrl: './create-familia.css',
})
export class CreateFamilia {
  private readonly fb = inject(FormBuilder);
  private readonly familiasService = inject(FamiliasApiService);
  private readonly message = inject(NzMessageService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  form = this.fb.group({
    nome: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
  });

  isSubmitting = false;

  submitFamilia(): void {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((ctrl) => {
        if (ctrl.invalid) {
          ctrl.markAsDirty();
          ctrl.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const nome = this.form.getRawValue().nome.trim();
    this.isSubmitting = true;
    this.cdr.markForCheck();

    this.familiasService.createFamilia({ nome }).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.message.success(`Família "${created.nome}" cadastrada com sucesso!`);
        this.form.reset();
        this.cdr.markForCheck();
        this.router.navigateByUrl('/familias');
      },
      error: (err: any) => {
        this.isSubmitting = false;
        const msg = err?.error?.message
          || (Array.isArray(err?.error?.details) ? err.error.details.join(' ') : null)
          || 'Erro ao cadastrar família.';
        this.message.error(msg);
        this.cdr.markForCheck();
        console.error(err);
      },
    });
  }
}
