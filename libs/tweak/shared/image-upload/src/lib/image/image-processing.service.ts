import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Image processing service using tinify
 * - compress images
 * - resize images
 * - crop images
 */
@Injectable()
export class ImageProcessingService {
  private http = inject(HttpClient);

  private apiKey = '26TSnV4TBvM0r3ynJtTtWMjHCTRThD83';

  /**
   * Compress an image
   * @param image Image to compress
   */
  public compress(image: File) {
    console.log('compressing image', image);

    // get blob from file
    const formData = new FormData();
    formData.append('image', image);

    // send formdata to tinify
    return this.http.post('https://api.tinify.com/shrink', formData, {
      headers: {
        Authorization: `Basic ${btoa(`api:${this.apiKey}`)}`,
      },
    });
  }
}
