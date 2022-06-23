import { Injectable } from '@angular/core';
import { createClient, SupabaseClient} from '@supabase/supabase-js';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get artists$() {
    return from(
      this.supabase
        .from('artist')
        .select('*')
        .limit(10)
    ).pipe(
      map(res => res.data)
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
}
