import { Component, Input } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal-family',
  imports: [NzButtonModule, NzModalModule],
  templateUrl: './modal-family.component.html',
})
export class ModalFamilyComponent {
  isVisible = false;
  @Input() listData: string[] = [];
  @Input() triggerLabel = 'Familia';
  @Input() title = 'Familia do membro';

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
