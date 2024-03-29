import { Injectable, signal } from '@angular/core';
import {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from '@tweak/interfaces/database-definitions';
import {
  Day,
  DayEvent,
  DayInsert,
  Event,
} from '@tweak/interfaces/database-entities';
import {
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { Observable, from, map } from 'rxjs';
import { environment } from '@shared/environments';

export type Bucket = 'event' | 'artist' | 'icon';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;
  private user = signal<User | null>(null);
  private session = signal<Session | null>(null);
  // private authSession: AuthSession | null = null;
  // private oauthSession: OAuthResponse | null = null;

  constructor() {
    this.supabase = createClient<Database>(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  async signIn(email: string, password: string): Promise<void> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) console.error(error);

    this.user.set(data.user);
    this.session.set(data.session);
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  setSession(session: Session): void {
    this.session.set(session);
  }

  fetchDays(): Observable<Day[]> {
    return from(
      this.supabase.from('day').select('*').order('day', { ascending: true })
    ).pipe(
      map(({ data: days, error }) => {
        if (error) throw error;

        return days as Day[];
      })
    );
  }

  upsertDay(day: DayInsert): Observable<Tables<'day'>[]> {
    return this.upsert<'day'>('day', day);
  }

  deleteDay(id: string): Observable<void> {
    return this.delete<'day'>('day', id);
  }

  fetchEvents(): Observable<Event[]> {
    return from(
      this.supabase
        .from('event')
        .select(
          `
                *,
                day_event(
                    day(id, name)
                )
            `
        )
        .order('name', { ascending: true })
    ).pipe(
      map(({ data: events, error }) => {
        if (error) throw error;

        return events;
      })
    );
  }

  upsertEvent(
    event: TablesInsert<'event'> | TablesUpdate<'event'>
  ): Observable<Tables<'event'>[]> {
    return this.upsert<'event'>('event', event);
  }

  deleteEvent(id: string): Observable<void> {
    return this.delete<'event'>('event', id);
  }

  upsertDayEvent(dayId: string, eventId: string): Observable<DayEvent[]> {
    return from(
      this.supabase
        .from('day_event')
        .upsert({ day_id: dayId, event_id: eventId })
        .select()
    ).pipe(
      map(({ data: dayEvent, error }) => {
        if (error) throw error;

        return dayEvent;
      })
    );
  }

  deleteDayEvents(eventId: string): Observable<void> {
    return from(
      this.supabase.from('day_event').delete().eq('event_id', eventId)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }

  public fetchArtists(): Observable<Tables<'artist'>[]> {
    return from(
      this.supabase
        .from('artist')
        .select('*')
        .order('name', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;

        return data as Tables<'artist'>[];
      })
    );
  }

  upsertArtist(artist: TablesInsert<'artist'> | TablesUpdate<'artist'>): Observable<Tables<'artist'>[]> {
    return this.upsert<'artist'>('artist', artist);
  }

  updateArtist(id: string, update: Partial<Tables<'artist'>>): Observable<void> {
    return from(
      this.supabase
        .from('artist')
        .update(update)
        .eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    )
  }

  deleteArtist(id: string): Observable<void> {
    return this.delete<'artist'>('artist', id);
  }

  uploadFile(bucket: Bucket, fileName: string, image: Blob): Observable<any> {
    return from(
      this.supabase.storage
        .from(bucket)
        .upload(fileName, image, { upsert: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;

        return data;
      })
    );
  }

  deleteFile(bucket: Bucket, fileName: string): Observable<any> {
    return from(
      this.supabase.storage.from(bucket).remove([fileName])
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;

        return data
      })
    );
  }

  // public async updloadImage(image: Blob) {
  //   const { data, error } = await this.supabase.functions.invoke('image', {
  //     body: {
  //       name: 'Functions'
  //     },
  //   })
  // }

  publicImageUrl(
    bucket: string,
    path: string,
  ): string {
    return `${environment.supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
  }

  private upsert<T extends keyof Database['public']['Tables']>(
    tableName: T,
    payload: TablesInsert<T> | TablesUpdate<T>
  ): Observable<Tables<T>[]> {
    return from(
      this.supabase
        .from(tableName)
        .upsert(payload)
        .select()
        .returns<Tables<T>[]>()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;

        return data;
      })
    );
  }

  private delete<T extends keyof Database['public']['Tables']>(
    tableName: T,
    id: string
  ): Observable<void> {
    return from(this.supabase.from(tableName).delete().eq('id', id)).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }

  //RPC
  //   tableAsGeojson(
  //     table: MapSource
  //   ): Observable<FeatureCollection<Point | LineString | Polygon>> {
  //     return from(this.supabase.rpc('table_as_geojson', { _tbl: table })).pipe(
  //       map((res: any) => res.data.geojson)
  //     );
  //   }

  // UTILS
  public getBucketAndPath(storagePath: string): [string, string] {

    const [bucket, ...path] = storagePath.split('/');

    return [bucket, path.join('/')];
  };

}
