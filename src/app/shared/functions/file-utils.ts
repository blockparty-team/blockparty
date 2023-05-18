import { Observable, fromEvent, of } from "rxjs";
import { catchError, map, takeUntil } from 'rxjs/operators';

export const blobToBase64 = (blob: Blob): Observable<string | ArrayBuffer> => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);

    return fromEvent(reader, 'load').pipe(
        map(() => reader.result),
        takeUntil(fromEvent(reader, 'error')),
        takeUntil(fromEvent(reader, 'abort'))
    );
}

export const imgFromUrl = (url: string): Observable<HTMLImageElement | null> => {
    return new Observable(observer => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            observer.next(img);
            observer.complete();
        };
        img.src = url;
        img.onerror = error => observer.error(error);
    }).pipe(
        // Catch error to prevent all images loads to fail when used in forkJoin.
        catchError<any, any>(error => {
          console.error('map loadImage failed:', error);
          return of(null);
        })
      );
}

export const base64ToImg = (base64: string): HTMLImageElement => {
    const img = document.createElement('img');
    img.setAttribute('src', `data:image/png;base64,${base64}`);

    return img;
}

export const imgToBase64 = (img: HTMLImageElement): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    return canvas.toDataURL();
}
