import { Component } from '@angular/core';
import { DataPicker } from '../../components/data-picker/data-picker';

@Component({
  selector: 'app-home',
  imports: [DataPicker],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {}
