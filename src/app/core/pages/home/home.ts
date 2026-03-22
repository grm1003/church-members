import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Membertable } from "../../components/membertable/membertable";
import { Member } from '../../models/Member';
import { GetMembers } from '../../services/get-members';

@Component({
  selector: 'app-home',
  imports: [Membertable],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  private readonly membersService = inject(GetMembers);
  private readonly destroyRef = inject(DestroyRef);

  tableData: Member[] = [];

  constructor() {
    this.membersService.members$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((members) => {
        this.tableData = members;
      });
  }
}
