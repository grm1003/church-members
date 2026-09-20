import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { Familia, Member, MemberImportResponseDto, MemberSaveDto } from '../models/Member';

@Injectable({
  providedIn: 'root',
})
export class MembersApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  listMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.baseUrl}/members`).pipe(
      map((members) =>
        (members || []).map((member) => {
          const relacoes = member.relacoes ?? [];
          const familiaNames = relacoes
            .map((r) => r.nomeFamilia)
            .filter((nome): nome is string => typeof nome === 'string' && nome.length > 0);
          const familiaIds = relacoes
            .map((r) => r.familiaId)
            .filter((id): id is number => typeof id === 'number');

          return {
            ...member,
            aniversario: member.data ?? '',
            familia: familiaNames,
            familiaId: familiaIds,
            relacoes,
            tipoRelacao: relacoes[0]?.tipoRelacao ?? 'OUTRO',
          };
        })
      ),
      catchError((error: unknown) => {
        console.warn('Erro ao carregar membros da API:', error);
        return of([] as Member[]);
      })
    );
  }

  getMember(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.baseUrl}/members/${id}`);
  }

  getMemberFamilies(id: number): Observable<Familia[]> {
    return this.http.get<Familia[]>(`${this.baseUrl}/members/${id}/familias`);
  }

  createMember(payload: MemberSaveDto): Observable<string> {
    return this.http.post(`${this.baseUrl}/members`, payload, { responseType: 'text' });
  }

  updateMember(id: number, payload: MemberSaveDto): Observable<Member> {
    return this.http.put<Member>(`${this.baseUrl}/members/${id}`, payload);
  }

  deleteMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/members/${id}`);
  }

  exportMembersCsv(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/members/export/csv`, {
      responseType: 'blob',
    });
  }

  exportMembersCsvToDownloads(): Observable<{ sucesso: boolean; caminho: string; mensagem: string }> {
    return this.http.post<{ sucesso: boolean; caminho: string; mensagem: string }>(
      `${this.baseUrl}/members/export/csv/downloads`,
      {}
    );
  }

  backupDatabase(): Observable<{ sucesso: boolean; caminho: string; mensagem: string }> {
    return this.http.post<{ sucesso: boolean; caminho: string; mensagem: string }>(
      `${this.baseUrl}/api/backup`,
      {}
    );
  }

  importMembersCsv(file: File): Observable<MemberImportResponseDto> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<MemberImportResponseDto>(`${this.baseUrl}/members/import/csv`, formData);
  }

  listMembersWithFamilies(): Observable<Member[]> {
    return this.listMembers();
  }
}