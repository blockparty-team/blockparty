import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
  input,
} from '@angular/core';

import { ImageCropperModule, ImageCroppedEvent } from 'ngx-image-cropper';
import { NotificationService } from '@tweak/services/notification.service';

@Component({
  selector: 'lib-image-cropper',
  imports: [ImageCropperModule],
  templateUrl: './image-cropper.component.html',
  styleUrl: './image-cropper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCropperComponent {
  public imageEvent = input<Event | null>(null);
  @Output() croppedImage = new EventEmitter<ImageCroppedEvent>();

  private notificationService = inject(NotificationService);

  onImageCropped(event: ImageCroppedEvent): void {
    this.croppedImage.emit(event);
  }

  onLoadImageFailed(): void {
    this.notificationService.showToast({
      message: 'Failed to load image',
      duration: 10000,
      color: 'danger',
    });
  }
}
