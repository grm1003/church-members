import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Member } from '../../models/Member';
import { DataPicker } from "../data-picker/data-picker";

@Component({
  selector: 'app-member-table',
  imports: [CommonModule, DataPicker, NzTableModule, NzButtonModule, NzIconModule],
  standalone: true,
  templateUrl: './membertable.html',
  styleUrl: './membertable.css',
})
export class Membertable implements OnInit {
  @Input() tableName: string = 'Tabela';
  @Input() tableData: Member[] = [];

  displayData: Member[] = [];
  isLoading = false;

  rerender() {
    this.displayData = [...this.tableData].sort(() => Math.random() - 0.5);
  }

  ngOnInit(): void {
    this.rerender();
  }
}
