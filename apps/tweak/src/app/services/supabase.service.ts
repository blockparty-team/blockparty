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

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;
  private user = signal<User | null>(null);
  private session = signal<Session | null>(null);
  // private authSession: AuthSession | null = null;
  // private oauthSession: OAuthResponse | null = null;

  constructor() {
    this.supabase = createClient<Database>(
      'http://localhost:54321',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
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

  public async updloadImage(image: Blob) {
    const { data, error } = await this.supabase.functions.invoke('image', {
      body: {
        name: 'Functions'
      },
    })
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
}
