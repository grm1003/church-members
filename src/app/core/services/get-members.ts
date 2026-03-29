import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Member } from '../models/Member';

@Injectable({
  providedIn: 'root',
})
export class GetMembers {
  private readonly initialMembers: Member[] = [
    { nome: 'John Doe', email: 'john@example.com', aniversario: '1990-01-01', familia: ['Jane Smith'] },
    { nome: 'Jane Smith', email: 'jane@example.com', aniversario: '1992-05-15', familia: ['John Doe'] },
  ];

  private readonly membersSubject = new BehaviorSubject<Member[]>([...this.initialMembers]);
  readonly members$ = this.membersSubject.asObservable();

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

    this.membersSubject.next([...updatedMembers, newMember]);
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
    return true;
  }
}
