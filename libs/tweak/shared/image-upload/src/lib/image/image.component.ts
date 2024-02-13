import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { ImageProcessingService } from './image-processing.service';
import { SupabaseService } from '@tweak/services/supabase.service';
import {
  ImageCroppedEvent,
  ImageCropperModule,
  LoadedImage,
} from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'lib-image',
  standalone: true,
  imports: [IonIcon, CommonModule, IonButton, IonIcon, ImageCropperModule],
  providers: [ImageProcessingService],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent {
  imageChangedEvent: any = '';
  croppedImage: any = '';

  private imageProcessingService = inject(ImageProcessingService);
  private supabase = inject(SupabaseService);
  private sanitizer = inject(DomSanitizer);

  onFileChange(event: Event) {
    // const files = (event.target as HTMLInputElement)?.files;
    // if (files) {
    //   this.imageProcessingService.compress(files[0]).subscribe();
    // }

    this.supabase.updloadImage(new Blob());
    // const file = (event.target as HTMLInputElement)?.files
    // this.imageProcessingService.compress('test');
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(
      event.objectUrl as any
    );
    // event.blob can be used to upload the cropped image
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
}
