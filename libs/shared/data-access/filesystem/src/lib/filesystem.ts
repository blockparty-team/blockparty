import { Injectable } from '@angular/core';
import { Filesystem, Directory, WriteFileResult } from '@capacitor/filesystem';
import { EMPTY, Observable, catchError, from, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FilesystemService {
  public writeFile(
    base64Data: string,
    path: string
  ): Observable<WriteFileResult> {
    return from(
      Filesystem.writeFile({
        directory: Directory.Cache,
        path,
        data: base64Data,
        recursive: true,
      })
    ).pipe(
      catchError((error) => {
        console.error(error);
        return EMPTY;
      })
    );
  }

  public readFile(path: string): Observable<string | Blob | null> {
    return from(
      Filesystem.readFile({
        directory: Directory.Cache,
        path,
      })
    ).pipe(
      map((result) => result.data),
      catchError(() => {
        return of(null);
      })
    );
  }

  public deleteFile(path: string): Observable<void> {
    return from(
      Filesystem.deleteFile({
        directory: Directory.Cache,
        path,
      })
    ).pipe(
      catchError((error) => {
        console.error(error);
        return EMPTY;
      })
    );
  }
}
