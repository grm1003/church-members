import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Member } from '../models/Member';

@Injectable({
  providedIn: 'root',
})
export class GetMembers {
  private readonly STORAGE_KEY = 'church-members-data';

  private readonly initialMembers: Member[] = [
    { nome: 'John Doe', email: 'john@example.com', aniversario: '1990-01-01', familia: ['Jane Smith'] },
    { nome: 'Jane Smith', email: 'jane@example.com', aniversario: '1992-05-15', familia: ['John Doe'] },
  ];

  private readonly membersSubject = new BehaviorSubject<Member[]>([]);
  readonly members$ = this.membersSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  getMembers(): Member[] {
    return [...this.membersSubject.value];
  }

  addMember(member: Member): void {
    const members = this.membersSubject.value;
    const newMemberName = member.nome.trim();
    const normalizedFamily = member.familia
      .map((name) => name.trim())
      .filter((name) => name.length > 0 && name.toLowerCase() !== newMemberName.toLowerCase());

    const uniqueFamily = [...new Set(normalizedFamily)];
    const familySet = new Set(uniqueFamily.map((name) => name.toLowerCase()));

    const updatedMembers = members.map((existing) => {
      const existingName = existing.nome.trim();
      if (!familySet.has(existingName.toLowerCase())) {
        return existing;
      }

      const alreadyRelated = existing.familia.some(
        (relativeName) => relativeName.trim().toLowerCase() === newMemberName.toLowerCase()
      );

      if (alreadyRelated) {
        return existing;
      }

      return {
        ...existing,
        familia: [...existing.familia, newMemberName],
      };
    });

    const newMember: Member = {
      ...member,
      nome: newMemberName,
      familia: uniqueFamily,
    };

    const allMembers = [...updatedMembers, newMember];
    this.membersSubject.next(allMembers);
    this.saveToStorage(allMembers);
  }

  removeMemberByName(name: string): boolean {
    const normalizedName = name.trim().toLowerCase();
    const members = this.membersSubject.value;
    const memberToRemove = members.find((member) => member.nome.trim().toLowerCase() === normalizedName);

    if (!memberToRemove) {
      return false;
    }

    const filteredMembers = members
      .filter((member) => member.nome.trim().toLowerCase() !== normalizedName)
      .map((member) => ({
        ...member,
        familia: member.familia.filter(
          (relativeName) => relativeName.trim().toLowerCase() !== normalizedName
        ),
      }));

    this.membersSubject.next(filteredMembers);
    this.saveToStorage(filteredMembers);
    return true;
  }

  private saveToStorage(members: Member[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(members));
    } catch (error) {
      console.warn('Erro ao salvar dados no localStorage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const members = JSON.parse(stored);
        this.membersSubject.next(members);
      } else {
        this.membersSubject.next([...this.initialMembers]);
        this.saveToStorage(this.initialMembers);
      }
    } catch (error) {
      console.warn('Erro ao carregar dados do localStorage:', error);
      this.membersSubject.next([...this.initialMembers]);
      this.saveToStorage(this.initialMembers);
    }
  }
}
