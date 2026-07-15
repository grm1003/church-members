import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { Familia, Member, MemberSaveDto } from '../models/Member';

@Injectable({
  providedIn: 'root',
})
export class MembersApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  listMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.baseUrl}/members`);
  }

  getMember(email: string): Observable<Member> {
    return this.http.get<Member>(`${this.baseUrl}/members/${encodeURIComponent(email)}`);
  }

  getMemberFamilies(email: string): Observable<Familia[]> {
    return this.http.get<Familia[]>(`${this.baseUrl}/members/${encodeURIComponent(email)}/familias`);
  }

  createMember(payload: MemberSaveDto): Observable<string> {
    return this.http.post(`${this.baseUrl}/members`, payload, { responseType: 'text' });
  }

  updateMember(email: string, payload: MemberSaveDto): Observable<Member> {
    return this.http.put<Member>(`${this.baseUrl}/members/${encodeURIComponent(email)}`, payload);
  }

  deleteMember(email: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/members/${encodeURIComponent(email)}`);
  }

  listMembersWithFamilies(): Observable<Member[]> {
    return this.listMembers().pipe(
      switchMap((members) => {
        if (members.length === 0) {
          return of([] as Member[]);
        }

        return forkJoin(
          members.map((member) =>
            this.getMemberFamilies(member.email).pipe(
              map((familias) => ({
                ...member,
                familia: familias.map((familia) => familia.nome),
              }))
            )
          )
        );
      }),
      catchError((error: unknown) => {
        console.warn('Erro ao carregar membros da API:', error);
        return of([] as Member[]);
      })
    );
  }
}