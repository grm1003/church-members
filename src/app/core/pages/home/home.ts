import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
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
export class Home implements OnInit {
  private readonly membersService = inject(GetMembers);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  tableData: Member[] = [];
  isLoading = false;

  constructor() {
    this.membersService.members$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((members) => {
        this.tableData = members;
        this.cdr.markForCheck();
      });

    this.membersService.isLoading$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((loading) => {
        this.isLoading = loading;
        this.cdr.markForCheck();
      });
  }

  ngOnInit(): void {
    this.membersService.reloadMembers();
  }
}
