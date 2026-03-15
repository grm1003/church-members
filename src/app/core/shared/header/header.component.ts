import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() user: string = 'Fulano de Tal';
  randomColor: string = this.getRandomColor();

  getRandomColor(): string {
    const colors = [
      'bg-blue-50',
      'bg-red-50',
      'bg-orange-50'
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }
}
