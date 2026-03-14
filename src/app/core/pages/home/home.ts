import { Component } from '@angular/core';
import { DataPicker } from '../../components/data-picker/data-picker';
import { Membertable } from "../../components/membertable/membertable";
import { Member } from '../../models/Member';

@Component({
  selector: 'app-home',
  imports: [DataPicker, Membertable],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  tableData: Member[] = [
    { nome: 'John Doe', email: 'john@example.com', aniversario: '1990-01-01' },
    { nome: 'Jane Smith', email: 'jane@example.com', aniversario: '1992-05-15' }
  ];
}
