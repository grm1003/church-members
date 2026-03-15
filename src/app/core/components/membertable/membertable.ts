import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, signal, OnInit } from '@angular/core';
import { Member } from '../../models/Member';
import { DataPicker } from "../data-picker/data-picker";
import {
  ColumnDef,
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel
} from '@tanstack/angular-table';


const defaultColumns: ColumnDef<Member>[] = [
  {
    accessorKey: 'nome',
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  },
  {
    accessorFn: (row) => row.email,
    id: 'email',
    cell: (info) => `<i>${info.getValue<string>()}</i>`,
    header: () => `<span>Email</span>`,
    footer: (info) => info.column.id,
  },
  {
    accessorKey: 'aniversario',
    header: () => 'Aniversário',
    footer: (info) => info.column.id,
  }
]

@Component({
  selector: 'app-member-table',
  imports: [CommonModule, DataPicker, FlexRenderDirective],
   standalone: true,
  templateUrl: './membertable.html',
  styleUrl: './membertable.css',
})
export class Membertable implements OnInit {
  @Input() tableName: string = 'Tabela';
  @Input() tableData: Member[] = [];

   data = signal<Member[]>(this.tableData)

  table = createAngularTable(() => ({
    data: this.data(),
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  }))

  rerender() {
    this.data.set([...this.tableData.sort(() => -1)])
  }

  ngOnInit(): void {
    this.rerender()
  }
}
