import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Member, MemberSaveDto } from '../models/Member';
import { MembersApiService } from './members-api.service';

@Injectable({
  providedIn: 'root',
})
export class GetMembers {
  private readonly membersApi = inject(MembersApiService);
  private readonly membersSubject = new BehaviorSubject<Member[]>([]);
  readonly members$ = this.membersSubject.asObservable();

  constructor() {
    this.loadFromApi();
  }

  getMembers(): Member[] {
    return [...this.membersSubject.value];
  }

  addMember(member: Member | MemberSaveDto): void {
    const payload: MemberSaveDto = {
      nome: member.nome.trim(),
      email: member.email.trim(),
      data: member.data.trim(),
      familiaId: [...new Set(member.familiaId ?? [])],
      tipoRelacao: member.tipoRelacao ?? 'OUTRO',
    };

    this.membersApi.createMember(payload).subscribe({
      next: () => this.loadFromApi(),
      error: (error: unknown) => console.warn('Erro ao salvar membro na API:', error),
    });
  }

  removeMemberByName(name: string): boolean {
    const normalizedName = name.trim().toLowerCase();
    const members = this.membersSubject.value;
    const memberToRemove = members.find((member) => member.nome.trim().toLowerCase() === normalizedName);

    if (!memberToRemove) {
      return false;
    }

    this.membersApi.deleteMember(memberToRemove.email).subscribe({
      next: () => this.loadFromApi(),
      error: (error: unknown) => console.warn('Erro ao remover membro da API:', error),
    });
    return true;
  }

  private loadFromApi(): void {
    this.membersApi.listMembersWithFamilies().subscribe({
      next: (members) => this.membersSubject.next(members),
      error: (error: unknown) => {
        console.warn('Erro ao carregar membros da API:', error);
        this.membersSubject.next([]);
      },
    });
  }
}
