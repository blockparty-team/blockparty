import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
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

  get artists$(): Observable<definitions['artist'][]> {
    return from(
      this.client
        .from<definitions['artist']>('artist')
        .select()
        .order('name')
        .limit(10)
    ).pipe(
      map(res => res.data)
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
  tableAsGeojson(table: keyof definitions) {
    return from(
      this.client.rpc('table_as_geojson', {_tbl: table})
    ).pipe(
      pluck('data', 'geojson')
    );
  }

}
