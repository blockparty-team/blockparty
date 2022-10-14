import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MapIconViewModel } from '@app/interfaces/map-icon';
import { forkJoin, Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';

interface File {
  fileName: string;
  url: SafeResourceUrl;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private supabaseService: SupabaseService,
    private readonly sanitizer: DomSanitizer
  ) { }

  get mapIconUrls$(): Observable<MapIconViewModel[]> {

    return this.supabaseService.mapIcons$.pipe(
      switchMap(files => forkJoin(
        files.map(file => this.supabaseService.downloadFile('icon', file.storage_path.split('/')[1]))
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

    return this.supabaseService.listBucketFiles(bucket).pipe(
      pluck('data'),
      switchMap(files => forkJoin(
        files.map(file => this.supabaseService.downloadFile(bucket, file.name))
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
}
