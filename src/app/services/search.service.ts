import { Injectable } from '@angular/core';
import { EntityDistanceSearchResult } from '@app/interfaces/entity-search-result';
import { Observable } from 'rxjs';
import { pluck, switchMap } from 'rxjs/operators';
import { GeolocationService } from './geolocation.service';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private supabase: SupabaseService,
    private geolocationService: GeolocationService
  ) { }

  get nearBy$(): Observable<EntityDistanceSearchResult[]> {
    return this.geolocationService.getCurrentPosition().pipe(
      pluck('coords'),
      switchMap(pos => this.supabase.distanceTo([pos.longitude, pos.latitude], 1000))
    );
  }


}
