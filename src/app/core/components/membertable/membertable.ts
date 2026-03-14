import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Member } from '../../models/Member';
import { DataPicker } from "../data-picker/data-picker";


@Component({
  selector: 'app-member-table',
  imports: [CommonModule, DataPicker],
  templateUrl: './membertable.html',
  styleUrl: './membertable.css',
})
export class Membertable {
  @Input() tableName: string = 'Tabela';
  @Input() tableData: Member[] = [];
}
