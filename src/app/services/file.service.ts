import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MapIconViewModel } from '@app/interfaces/map-icon';
import { forkJoin, Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';
import { imageSize } from '@app/shared/models/imageSize';
import { getBucketAndPath } from '@app/shared/functions/storage';

interface File {
  fileName: string;
  url: SafeResourceUrl;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private supabase: SupabaseService,
    private readonly sanitizer: DomSanitizer
  ) { }

  get mapIconUrls$(): Observable<MapIconViewModel[]> {

    return this.supabase.mapIcons$.pipe(
      switchMap(files => forkJoin(
        files.map(file => {
          const [bucket, path] = getBucketAndPath(file.storage_path);

          return this.supabase.downloadFile(bucket, path);
        })
      ).pipe(
        map(blobs => blobs.map((blob, i) => ({ blob, ...files[i] })))
      )),
      map(filesWithBlobs => {
        return filesWithBlobs.map(fileWithBlob => {

          if (fileWithBlob.blob instanceof Blob) {

            const { blob, ...file } = fileWithBlob

            return {
              ...file,
              fileUrl: URL.createObjectURL(blob)
            }
          }
        })
      })
    )

  }

  allFileUrls(bucket: string): Observable<SafeResourceUrl[]> {

    return this.supabase.listBucketFiles(bucket).pipe(
      pluck('data'),
      switchMap(files => forkJoin(
        files.map(file => this.supabase.downloadFile(bucket, file.name))
      ).pipe(
        map(blobs => blobs.map((blob, i) => ({ blob: blob, ...files[i] })))
      )),
      map(filesWithBlobs => {
        return filesWithBlobs.map(fileWithBlob => {

          if (fileWithBlob.blob instanceof Blob) {

            const { blob, ...file } = fileWithBlob

            const fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              URL.createObjectURL(blob)
            )

            return {
              ...file,
              fileUrl
            }
          }
        })
      })
    )
  }

  imageSrcset(bucket: string, path: string): string {
    const srcset = Object.values(imageSize).map(transformation => {
      const url = this.supabase.publicImageUrl(bucket, path, transformation)
      const width = transformation.width;

      return `${url} ${width}w`;
    })

    return srcset.join(', ');
  }
}
