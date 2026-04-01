import { ChangeDetectionStrategy, Component, output } from '@angular/core';

import { IonIcon, IonButton, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'lib-image-upload',
  imports: [IonText, IonIcon, IonButton],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadComponent {
  readonly imageEvent = output<Event>();

  onFileChanged(event: Event) {
    this.imageEvent.emit(event);
  }
}
