import { Component, Input, WritableSignal, signal } from '@angular/core';
import { IonModal } from '@ionic/angular/standalone';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss'],
  standalone: true,
  imports: [IonModal],
})
export class EditModalComponent {
  @Input() isOpen: WritableSignal<boolean> = signal(false);

  onDismiss() {
    this.isOpen.set(false);
  }
}
