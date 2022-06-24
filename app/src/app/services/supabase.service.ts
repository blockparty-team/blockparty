import { Injectable } from '@angular/core';
import { createClient, SupabaseClient} from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { definitions } from '../interfaces/supabase';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get artists$(): Observable<definitions['artist'][]> {
    return from(
      this.supabase
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
      this.supabase
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
      this.supabase
        .from('artist')
        .select()
        .textSearch('ts', searchTerm, {
          config: 'english',
          type: 'plain'
        })
    );
  }

  downloadPhoto(bucket: string, path: string) {
    return from(
      this.supabase
        .storage
        .from(bucket)
        .download(path)
    );
  }
}
