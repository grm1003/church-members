import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'app-data-picker',
	imports: [HlmDatePickerImports, HlmLabelImports],
	templateUrl: './data-picker.html',
	styleUrl: './data-picker.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataPicker {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}