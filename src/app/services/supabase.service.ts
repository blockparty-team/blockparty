import { Injectable } from '@angular/core';
import { ArtistWithRelations } from '@app/interfaces/artist';
import { DayWithRelations } from '@app/interfaces/entities-with-releation';
import { MapSource } from '@app/interfaces/map-layer';
import { DayEventStageTimetable } from '@app/interfaces/day-event-stage-timetable';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FeatureCollection, LineString, Point, Polygon } from 'geojson';
import { from, Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EntityDistanceSearchResult, EntityFreeTextSearchResult } from '@app/interfaces/entity-search-result';
import { Database } from '@app/interfaces/database-definitions';
import { Artist, Asset } from '@app/interfaces/database-entities';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient<Database>(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  get artists$(): Observable<ArtistWithRelations[]> {
    return from(
      this.supabase
        .from('artist')
        .select(`
          *,
          timetable(
            start_time,
            end_time,
            day(
              name,
              day
            ),
            stage(
              name,
              geom
            )
          )
        `)
        .order('name')
    ).pipe(
      map(res => res.data)
    );
  }

  get dayMaskBounds$(): Observable<any[]> {
    return from(
      this.supabase
        .from('day_event_mask')
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
      this.supabase
        .from('day')
        .select(`
          id,
          day,
          name,
          description,
          day_event(
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
                  day_id,
                  start_time,
                  end_time,
                  artist(
                    *
                  )
                )
              )
            )
          )
      `)
    ).pipe(
      pluck('data'),
      map(days => {
        return days.map(({ day_event, ...rest }) => {
          return {
            ...rest,
            event: (day_event as any[]).map(events => events.event)
          }
        })
      })
    );
  }

  get timetables$(): Observable<DayEventStageTimetable[]> {
    return from(
      this.supabase
        .from('day_event_stage_timetable')
        .select()
    ).pipe(
      pluck('data')
    )
  }

  get assets$(): Observable<Asset[]> {
    return from<any>(
      this.supabase
        .from('asset')
        .select(`
          id,
          name,
          description,
          asset_type(
            name
          )
        `)
    ).pipe(
      pluck('data')
    )
  }

  artist(id: string): Observable<Artist> {
    return from(
      this.supabase
        .from('artist')
        .select()
        .filter('id', 'eq', id)
        .single()
    ).pipe(
      pluck('data')
    );
  }

  searchArtist(searchTerm: string) {
    return from(
      this.supabase
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
      this.supabase
        .from('timetable')
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

  downloadImage(bucket: string, path: string) {
    return from(
      this.supabase
        .storage
        .from(bucket)
        .download(path)
    );
  }

  //RPC
  tableAsGeojson(table: MapSource): Observable<FeatureCollection<Point | LineString | Polygon>> {
    return from(
      this.supabase.rpc('table_as_geojson', { _tbl: table })
    ).pipe(
      pluck('data', 'geojson')
    );
  }

  distanceTo(coords: [number, number], withinDistance: number): Observable<EntityDistanceSearchResult[]> {
    return from(
      this.supabase.rpc('distance_to', { lng: coords[0], lat: coords[1], search_radius: withinDistance })
    ).pipe(
      pluck('data')
    );
  }

  textSearch(searchTerm: string): Observable<EntityFreeTextSearchResult[]> {
    return from(
      this.supabase
        .rpc('text_search', { 'search_term': searchTerm })
        .or(
          'rank.gt.0,similarity.gt.0.1'
        )
        .limit(10)
    ).pipe(
      pluck('data')
    );
  }

}
