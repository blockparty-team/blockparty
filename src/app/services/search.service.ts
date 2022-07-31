import { Injectable } from '@angular/core';
import { definitions } from '@app/interfaces/supabase';
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

  get nearBy$(): Observable<Partial<definitions['entity_distance_search']>[]> {
    return this.geolocationService.getCurrentPosition().pipe(
      pluck('coords'),
      switchMap(pos => this.supabase.distanceTo([pos.longitude, pos.latitude], 100000))
    );
  }


}
