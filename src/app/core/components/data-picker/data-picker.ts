import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'app-data-picker',
	imports: [HlmDatePickerImports, HlmLabelImports],
	templateUrl: './data-picker.html',
	styleUrl: './data-picker.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})


export class DataPicker implements OnInit, OnChanges {
  @Input() selectedDate: Date = new Date();
  @Output() dateSelected = new EventEmitter<Date>();

  /** The minimum date */
  public minDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 4000); // 10 years ago

  /** The maximum date */
  public maxDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365); // 1 year from now

  ngOnInit(): void {
    // Emite a data padrão (hoje) sempre que o componente é iniciado
    this.dateSelected.emit(this.selectedDate);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate'] && !changes['selectedDate'].isFirstChange()) {
      this.dateSelected.emit(this.selectedDate);
    }
  }

  // Chamado pelo template do date picker quando o usuário seleciona uma data
  onPickerChange(date: Date) {
    this.selectedDate = date;
    this.dateSelected.emit(this.selectedDate);
  }
}
