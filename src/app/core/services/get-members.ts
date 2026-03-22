import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Member } from '../models/Member';

@Injectable({
  providedIn: 'root',
})
export class GetMembers {
  private readonly initialMembers: Member[] = [
    { nome: 'John Doe', email: 'john@example.com', aniversario: '1990-01-01' },
    { nome: 'Jane Smith', email: 'jane@example.com', aniversario: '1992-05-15' },
  ];

  private readonly membersSubject = new BehaviorSubject<Member[]>([...this.initialMembers]);
  readonly members$ = this.membersSubject.asObservable();

  getMembers(): Member[] {
    return [...this.membersSubject.value];
  }

  addMember(member: Member): void {
    const members = this.membersSubject.value;
    this.membersSubject.next([...members, member]);
  }
}
