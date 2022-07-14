import { Injectable } from '@angular/core';
import { ArtistWithRelations } from '@app/interfaces/artist';
import { DayWithRelations } from '@app/interfaces/entities-with-releation';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FeatureCollection, LineString, Point, Polygon } from 'geojson';
import { from, Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { definitions } from '../interfaces/supabase';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get artists$(): Observable<ArtistWithRelations[]> {
    return from(
      this.client
        .from<ArtistWithRelations>('artist')
        .select(`
          *,
          timetable(
            start_time,
            end_time,
            day(
              name
            ),
            stage(
              name
            )
          )
        `)
        .order('name')
    ).pipe(
      map(res => res.data)
    );
  }

  get dayMaskBounds$(): Observable<definitions['day_event_mask'][]> {
    return from(
      this.client
        .from<definitions['day_event_mask']>('day_event_mask')
        .select(`
          id,
          bounds
        `)
    ).pipe(
      map(res => res.data)
    );
  }

  get days$(): Observable<DayWithRelations[]> {
    return from(
      this.client
        .from<DayWithRelations>('day')
        .select(`
          id,
          day,
          name,
          description,
          event(
            id,
            name,
            description,
            bounds,
            stage(
              id,
              name, 
              description,
              timetable(
                id,
                start_time,
                end_time,
                artist(
                  *
                )

              )
            )
          )
        `)
    ).pipe(
      pluck('data')
    );
  }

  artist(id: string): Observable<definitions['artist']> {
    return from(
      this.client
        .from<definitions['artist']>('artist')
        .select()
        .filter('id', 'eq', id)
        .single()
    ).pipe(
      map(res => res.data)
    );;
  }

  searchArtist(searchTerm: string) {
    return from(
      this.client
        .from('artist')
        .select()
        .textSearch('ts', searchTerm, {
          config: 'english',
          type: 'plain'
        })
    );
  }

  stageTimeTable(stageId: string) {
    return from(
      this.client
        .from<definitions['timetable']>('timetable')
        .select(`
          start_time,
          end_time,
          artist(
            id,
            name
          ),
          stage(
            name
          )
        `)
        .filter('stage_id', 'eq', stageId)
        .order('start_time')
    ).pipe(
      pluck('data')
    );
  }



  downloadPhoto(bucket: string, path: string) {
    return from(
      this.client
        .storage
        .from(bucket)
        .download(path)
    );
  }

  //RPC
  tableAsGeojson(table: keyof definitions): Observable<FeatureCollection<Point | LineString | Polygon>> {
    return from(
      this.client.rpc('table_as_geojson', { _tbl: table })
    ).pipe(
      pluck('data', 'geojson')
    );
  }

}
