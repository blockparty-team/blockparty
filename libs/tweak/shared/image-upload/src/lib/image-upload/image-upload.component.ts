import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonButton } from '@ionic/angular/standalone'

@Component({
  selector: 'lib-image-upload',
  standalone: true,
  imports: [CommonModule, IonIcon, IonButton],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
})
export class ImageUploadComponent {
  @Output() imageEvent = new EventEmitter<Event>();

  onFileChanged(event: Event) {
    this.imageEvent.emit(event);
  }

}
