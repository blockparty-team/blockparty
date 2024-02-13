import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperModule, ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'lib-image-cropper',
  standalone: true,
  imports: [CommonModule, ImageCropperModule],
  templateUrl: './image-cropper.component.html',
  styleUrl: './image-cropper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCropperComponent {
  public imageEvent = input<Event | null>(null);
  @Output() croppedImage = new EventEmitter<Blob>();

  imageCropped(event: ImageCroppedEvent) {
    if (event.blob) {
      this.croppedImage.emit(event.blob);
    }
  }
}
