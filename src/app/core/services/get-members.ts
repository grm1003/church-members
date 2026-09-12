import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, defer, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { Member, MemberSaveDto } from '../models/Member';
import { MembersApiService } from './members-api.service';

@Injectable({
  providedIn: 'root',
})
export class GetMembers {
  private readonly membersApi = inject(MembersApiService);
  private readonly membersSubject = new BehaviorSubject<Member[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  readonly members$ = this.membersSubject.asObservable();
  readonly isLoading$ = this.loadingSubject.asObservable();

  constructor() {
    this.reloadMembers();
  }

  getMembers(): Member[] {
    return [...this.membersSubject.value];
  }

  addMember(member: MemberSaveDto): Observable<string> {
    const payload: MemberSaveDto = {
      nome: member.nome.trim(),
      email: member.email.trim(),
      data: member.data.trim(),
      tipoRelacao: member.tipoRelacao ?? [],
    };

    return this.membersApi.createMember(payload).pipe(
      switchMap((createdMsg) =>
        this.loadFromApi().pipe(
          map(() => createdMsg)
        )
      )
    );
  }

  removeMemberByName(name: string): Observable<void> {
    const normalizedName = name.trim().toLowerCase();

    const membersSource$ =
      this.membersSubject.value.length > 0
        ? of(this.membersSubject.value)
        : this.membersApi.listMembers();

    return membersSource$.pipe(
      switchMap((members) => {
        const memberToRemove = members.find(
          (member) => member.nome.trim().toLowerCase() === normalizedName
        );

        if (!memberToRemove) {
          throw new Error(`Nenhum membro encontrado com o nome: "${name}".`);
        }

        return this.membersApi.deleteMember(memberToRemove.email);
      }),
      switchMap(() => this.loadFromApi()),
      map(() => void 0)
    );
  }

  deleteMemberByEmail(email: string): Observable<void> {
    return this.membersApi.deleteMember(email).pipe(
      switchMap(() => this.loadFromApi()),
      map(() => void 0)
    );
  }

  reloadMembers(): void {
    this.loadFromApi().subscribe();
  }

  private loadFromApi(): Observable<Member[]> {
    return defer(() => {
      this.loadingSubject.next(true);
      return this.membersApi.listMembersWithFamilies().pipe(
        tap({
          next: (members) => {
            this.membersSubject.next(members);
          },
          error: (error: unknown) => {
            console.warn('Erro ao carregar membros da API:', error);
            this.membersSubject.next([]);
          },
        }),
        finalize(() => {
          this.loadingSubject.next(false);
        })
      );
    });
  }
}
