import { Component, Input, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MembersApiService } from '../../services/members-api.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, NzButtonModule, NzIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() user: string = 'Fulano de Tal';
  private readonly membersApiService = inject(MembersApiService);
  private readonly message = inject(NzMessageService);
  private readonly cdr = inject(ChangeDetectorRef);

  isBackingUp = false;

  backupBanco(): void {
    this.isBackingUp = true;
    this.cdr.markForCheck();

    this.membersApiService.backupDatabase()
      .pipe(finalize(() => {
        this.isBackingUp = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: (res) => {
          this.message.success('Backup do banco criado com sucesso em C:\\ProgramData\\ChurchMembers\\backup!');
        },
        error: (err) => {
          this.message.error('Erro ao realizar backup do banco de dados.');
          console.error(err);
        }
      });
  }
}
