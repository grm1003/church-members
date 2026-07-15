import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { Familia, Member, RelacaoFamiliaOption } from '../models/Member';

@Injectable({
  providedIn: 'root',
})
export class FamiliasApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  listFamilias(): Observable<Familia[]> {
    return this.http.get<Familia[]>(`${this.baseUrl}/familias`);
  }

  listRelacoes(): Observable<RelacaoFamiliaOption[]> {
    return this.http.get<RelacaoFamiliaOption[]>(`${this.baseUrl}/familias/relacoes`);
  }

  listFamiliaMembers(familiaId: number): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.baseUrl}/familias/${familiaId}/membros`);
  }

  createFamilia(payload: Pick<Familia, 'nome'>): Observable<Familia> {
    return this.http.post<Familia>(`${this.baseUrl}/familias`, payload);
  }

  deleteFamilia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/familias/${id}`);
  }
}