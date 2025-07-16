import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

import { IonIcon, IonButton, IonText } from '@ionic/angular/standalone'

@Component({
  selector: 'lib-image-upload',
  standalone: true,
  imports: [IonText, IonIcon, IonButton],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadComponent {
  @Output() imageEvent = new EventEmitter<Event>();

  onFileChanged(event: Event) {
    this.imageEvent.emit(event);
  }
}
