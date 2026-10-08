import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { finalize } from 'rxjs';
import { MemberEstatisticasDto, MemberResumoDto } from '../../models/Member';
import { MembersApiService } from '../../services/members-api.service';

@Component({
  selector: 'app-member-stats',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzTableModule,
    NzButtonModule,
    NzInputNumberModule,
    NzSelectModule,
    NzSpinModule,
    NzIconModule,
    NzTagModule,
    NzStatisticModule,
  ],
  templateUrl: './member-stats.html',
  styleUrl: './member-stats.css',
})
export class MemberStats implements OnInit {
  private readonly membersApi = inject(MembersApiService);
  private readonly message = inject(NzMessageService);
  private readonly cdr = inject(ChangeDetectorRef);

  stats: MemberEstatisticasDto = {
    total: 0,
    totalMasculino: 0,
    totalFeminino: 0,
  };
  isLoadingStats = false;

  generoFilter = 'TODOS';
  minIdade: number | null = null;
  maxIdade: number | null = null;

  membros: MemberResumoDto[] = [];
  filteredTotal = 0;
  isLoadingTable = false;

  ngOnInit(): void {
    this.carregarEstatisticas();
    this.aplicarFiltro();
  }

  carregarEstatisticas(): void {
    this.isLoadingStats = true;
    this.cdr.markForCheck();

    this.membersApi
      .getEstatisticas()
      .pipe(
        finalize(() => {
          this.isLoadingStats = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (dados) => {
          this.stats = dados;
        },
        error: (err: unknown) => {
          console.error('Erro ao carregar estatísticas:', err);
          this.message.error('Não foi possível carregar as estatísticas consolidadas.');
        },
      });
  }

  aplicarFiltro(): void {
    this.isLoadingTable = true;
    this.cdr.markForCheck();

    this.membersApi
      .filtrarMembros(this.generoFilter, this.minIdade, this.maxIdade)
      .pipe(
        finalize(() => {
          this.isLoadingTable = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (res) => {
          this.membros = res.membros || [];
          this.filteredTotal = res.total;
        },
        error: (err: unknown) => {
          console.error('Erro ao filtrar membros:', err);
          this.message.error('Erro ao aplicar filtros de membros.');
        },
      });
  }

  limparFiltros(): void {
    this.generoFilter = 'TODOS';
    this.minIdade = null;
    this.maxIdade = null;
    this.aplicarFiltro();
  }
}
