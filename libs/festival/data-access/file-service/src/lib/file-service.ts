import { Injectable, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SupabaseService } from '@blockparty/shared/data-access/supabase';
import { imageSize } from '@blockparty/festival/shared/types';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private sanitizer = inject(DomSanitizer);
  private supabase = inject(SupabaseService);

  allFileUrls(bucket: string): Observable<SafeResourceUrl[]> {
    return this.supabase.listBucketFiles(bucket).pipe(
      map((res) => res.data),
      switchMap((files) =>
        forkJoin(
          files!.map((file) => this.supabase.downloadFile(bucket, file.name)),
        ).pipe(
          map((blobs) =>
            blobs.map((blob, i) => ({ blob: blob, ...files![i] })),
          ),
        ),
      ),
      map((filesWithBlobs) => {
        return filesWithBlobs.map((fileWithBlob) => {
          if (fileWithBlob.blob instanceof Blob) {
            const { blob, ...file } = fileWithBlob;

            const fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              URL.createObjectURL(blob),
            );

            return {
              ...file,
              fileUrl,
            };
          }

          return null;
        });
      }),
    ) as Observable<SafeResourceUrl[]>;
  }

  imageSrcset(bucket: string, path: string): string {
    const srcset = Object.values(imageSize).map((transformation) => {
      const url = this.supabase.publicImageUrl(bucket, path, transformation);
      const width = transformation.width;

      return `${url} ${width}w`;
    });

    return srcset.join(', ');
  }
}
