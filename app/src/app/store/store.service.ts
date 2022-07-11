import { Injectable } from '@angular/core';
import { DayWithRelations } from '@app/interfaces/entities-with-releation';
import { definitions } from '@app/interfaces/supabase';
import { DeviceStorageService } from '@app/services/device-storage.service';
import { SupabaseService } from '@app/services/supabase.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, filter, switchMap, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private _daysWithRelations$ = new BehaviorSubject<DayWithRelations[]>(null);
  daysWithRelations$: Observable<DayWithRelations[]> = this._daysWithRelations$.asObservable();

  private _artists$ = new BehaviorSubject<definitions['artist'][]>(null);
  artists$: Observable<definitions['artist'][]> = this._artists$.asObservable().pipe(
    filter(artists => artists === null),
    switchMap(() => this.supabase.artists$),
    tap(artists => {
      this._artists$.next(artists);
      this.deviceStorageService.set('artists', artists);
    })
  );

  constructor(
    private supabase: SupabaseService,
    private deviceStorageService: DeviceStorageService
  ) { }

  updateEntities(): void {
    this.supabase.allEntities().pipe(
      tap(entities => this._daysWithRelations$.next(entities))
    ).subscribe();
  }

  updateArtists(): void {
    this.supabase.artists$.pipe(
      tap(artists => this._artists$.next(artists))
    ).subscribe();
  }

}
