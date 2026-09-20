import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { finalize } from 'rxjs';
import { MemberImportResponseDto } from '../../models/Member';
import { GetMembers } from '../../services/get-members';
import { MembersApiService } from '../../services/members-api.service';

@Component({
  selector: 'app-csv-modal',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    NzUploadModule,
    NzAlertModule,
    NzSpinModule,
    NzTagModule,
    NzDividerModule,
  ],
  templateUrl: './csv-modal.component.html',
  styleUrl: './csv-modal.component.css',
})
export class CsvModalComponent {
  @Input() isVisible = false;
  @Output() readonly isVisibleChange = new EventEmitter<boolean>();
  @Output() readonly importSuccess = new EventEmitter<MemberImportResponseDto>();

  private readonly membersApiService = inject(MembersApiService);
  private readonly getMembersService = inject(GetMembers);
  private readonly message = inject(NzMessageService);
  private readonly cdr = inject(ChangeDetectorRef);

  fileList: NzUploadFile[] = [];
  selectedFile: File | null = null;
  isProcessing = false;
  isExporting = false;
  isExportingDownloads = false;
  importResult: MemberImportResponseDto | null = null;

  beforeUpload = (file: NzUploadFile): boolean => {
    const rawFile = file as unknown as File;
    const isCsv = file.name.toLowerCase().endsWith('.csv');

    if (!isCsv) {
      this.message.error('Por favor, selecione apenas arquivos com extensão .csv');
      return false;
    }

    this.selectedFile = rawFile;
    this.fileList = [file];
    this.importResult = null;
    return false; // Evita upload automático pelo componente nz-upload
  };

  handleRemove = (): boolean => {
    this.selectedFile = null;
    this.fileList = [];
    this.importResult = null;
    return true;
  };

  handleCancel(): void {
    this.isVisible = false;
    this.isVisibleChange.emit(false);
  }

  processImport(): void {
    if (!this.selectedFile) {
      this.message.warning('Nenhum arquivo CSV selecionado.');
      return;
    }

    this.isProcessing = true;
    this.importResult = null;
    this.cdr.markForCheck();

    this.membersApiService
      .importMembersCsv(this.selectedFile)
      .pipe(
        finalize(() => {
          this.isProcessing = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response) => {
          this.importResult = response;

          if (response.membrosSalvos > 0) {
            this.message.success(
              `Importação concluída: ${response.membrosSalvos} membro(s) processado(s) com sucesso!`
            );
            this.getMembersService.reloadMembers();
            this.importSuccess.emit(response);
          } else if (response.erros && response.erros.length > 0) {
            this.message.warning('O arquivo foi lido, mas nenhum membro pôde ser salvo devido a erros.');
          }
          this.cdr.markForCheck();
        },
        error: (error) => {
          const msg = error?.error?.message || error?.message || 'Falha ao importar arquivo CSV.';
          this.message.error(`Erro na importação: ${msg}`);
          this.cdr.markForCheck();
        },
      });
  }

  downloadTemplate(): void {
    const header = 'email;nome;data_nascimento;nome_familia;relacao\n';
    const example1 = 'joao.silva@exemplo.com;João da Silva;15/04/1988;Silva;PAI\n';
    const example2 = 'maria.silva@exemplo.com;Maria da Silva;20/08/1990;Silva;MAE\n';
    const example3 = 'pedro.silva@exemplo.com;Pedro da Silva;10/12/2015;Silva;FILHO\n';
    const content = '\uFEFF' + header + example1 + example2 + example3;

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo_importacao_membros.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.message.info('Download do modelo CSV iniciado.');
  }

  exportCurrentMembers(): void {
    this.isExporting = true;
    this.cdr.markForCheck();

    this.membersApiService
      .exportMembersCsv()
      .pipe(
        finalize(() => {
          this.isExporting = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'membros.csv';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          this.message.success('Lista de membros exportada com sucesso!');
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.message.error('Erro ao exportar membros para CSV.');
          console.error(error);
          this.cdr.markForCheck();
        },
      });
  }

  exportToDownloads(): void {
    this.isExportingDownloads = true;
    this.cdr.markForCheck();

    this.membersApiService
      .exportMembersCsvToDownloads()
      .pipe(
        finalize(() => {
          this.isExportingDownloads = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (res) => {
          this.message.success(res.mensagem || 'Arquivo salvo na pasta Downloads!');
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.message.error('Erro ao salvar CSV na pasta Downloads.');
          console.error(error);
          this.cdr.markForCheck();
        },
      });
  }
}
