import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output
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
  readonly croppedImage = output<ImageCroppedEvent>();

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
