import { Injectable } from '@angular/core';
import { isPlatform, Platform } from '@ionic/angular/standalone';
import { BehaviorSubject, EMPTY, from, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  OAuthResponse,
  Provider,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { FeatureCollection, LineString, Point, Polygon } from 'geojson';

// import { DeviceStorageService } from '@blockparty/shared/data-access/device-storage';
import {
  ArtistViewModel,
  MapSource,
  DayEventStageTimetable,
  EntityDistanceSearchResult,
  EntityFreeTextSearchResult,
  EventWithRelations,
  EventsGroupedByType,
  TransformOptions,
  AppConfig,
} from '@blockparty/festival/shared/types';
import {
  Database,
  Tables,
  Enums,
} from '@blockparty/shared/data-access/supabase';
import { environment } from '@shared/environments';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  private _session$ = new BehaviorSubject<AuthSession | null>(null);
  session$: Observable<AuthSession | null> = this._session$.asObservable();

  constructor(
    // private deviceStorage: DeviceStorageService,
    private platform: Platform,
  ) {
    this.supabase = createClient<Database>(
      environment.supabaseUrl,
      environment.supabaseAnonKey,
      {
        // auth: {
        //   storage: this.deviceStorage,
        //   autoRefreshToken: true,
        //   persistSession: true,
        //   detectSessionInUrl: !this.platform.is('capacitor')
        // }
      },
    );
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void,
  ) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  externalSetSession(access_token: string, refresh_token: string) {
    return this.supabase.auth.setSession({ access_token, refresh_token });
  }

  setSession(session: Session): void {
    this._session$.next(session);
  }

  signIn(email: string) {
    return from(this.supabase.auth.signInWithOtp({ email })).pipe(
      map(({ data, error }) => (error ? throwError(error) : data)),
      catchError((err) => EMPTY),
    );
  }

  signInWithProvider(
    provider: Provider,
    redirectTo: string = '/',
  ): Observable<OAuthResponse['data']> {
    return from(
      this.supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: isPlatform('capacitor')
            ? 'distortion://login'
            : `${window.location.origin}${redirectTo}`,
        },
      }),
    ).pipe(map(({ data }) => data));
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  async signUp(credentials: { email: string; password: string }) {
    return new Promise(async (resolve, reject) => {
      const { error, data } = await this.supabase.auth.signUp(credentials);

      if (error) {
        reject(error);
      } else {
        this._session$.next(data.session);
        resolve(data.session);
      }
    });
  }

  profile$(
    userId: User['id'],
  ): Observable<Pick<Tables<'profile'>, 'username' | 'avatar_url'>> {
    return from(
      this.supabase
        .from('profile')
        .select(`username, avatar_url`)
        .eq('id', userId)
        .single(),
    ).pipe(
      map(
        (res) => res.data as Pick<Tables<'profile'>, 'username' | 'avatar_url'>,
      ),
    );
  }

  get appConfig$(): Observable<AppConfig> {
    return from(
      this.supabase.from('app_config').select('config').limit(1).single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;

        return data.config;
      }),
    );
  }

  get artists$(): Observable<ArtistViewModel[]> {
    return from(
      this.supabase
        .from('artist')
        .select(
          `
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
              geom,
              event(
                name
              )
            )
          )
        `,
        )
        .order('name'),
    ).pipe(
      // TODO: Trouble with type, hence this cast
      map(({ data }) => data as ArtistViewModel[]),
    );
  }

  get dayMaskBounds$(): Observable<any[]> {
    return from(
      this.supabase.from('day_event_mask').select(`
          id,
          bounds
        `),
    ).pipe(map((res) => res.data as any[]));
  }

  get days$() {
    return from(
      this.supabase
        .from('day')
        .select(
          `
          id,
          day,
          name,
          day_event(
            event(
              id,
              name,
              bounds,
              rank,
              event_type(
                id,
                name,
                color,
                rank
              )
            )
          )
      `,
        )
        .order('day'),
    ).pipe(map((res) => res.data));
  }

  get events$(): Observable<EventWithRelations[]> {
    return from(
      this.supabase
        .from('event')
        .select(
          `
          id,
          name,
          description,
          storage_path,
          bounds,
          tickets,
          event_type(
            id,
            name,
            description,
            color
          ),
          day_event(
            day(
              name
            )
          ),
          stage(
            timetable(
              artist(
                name,
                id
              )
            )
          )
        `,
        )
        .order('name'),
    ).pipe(
      // TODO: Trouble with type, hence this cast
      map(({ data }) => data as unknown as EventWithRelations[]),
    );
  }

  get eventsGroupedByTypes$(): Observable<EventsGroupedByType[]> {
    return from(
      this.supabase
        .from('event_type')
        .select(
          `
          name,
          color,
          description,
          event(
            name,
            tickets
          )
        `,
        )
        .order('name'),
    ).pipe(map(({ data }) => data as EventsGroupedByType[]));
  }

  get timetables$(): Observable<DayEventStageTimetable[]> {
    return from(
      this.supabase.from('day_event_stage_timetable').select('*'),
    ).pipe(map((res) => res.data as DayEventStageTimetable[]));
  }

  searchArtist(searchTerm: string) {
    return from(
      this.supabase.from('artist').select('*').textSearch('ts', searchTerm, {
        config: 'english',
        type: 'plain',
      }),
    );
  }

  stageTimeTable(stageId: string) {
    return from(
      this.supabase
        .from('timetable')
        .select(
          `
          start_time,
          end_time,
          artist(
            id,
            name
          ),
          stage(
            name
          )
        `,
        )
        .filter('stage_id', 'eq', stageId)
        .order('start_time'),
    ).pipe(map((res) => res.data));
  }

  // Couldn't make supabase client upsert() work on composite primary keys hence this RPC
  upsertFavorites(
    devive_id: string,
    entity: Enums<'favorite_entity'>,
    ids: string[],
  ): Observable<any> {
    return from(
      this.supabase.rpc('upsert_favorite', {
        _device_id: devive_id,
        _entity: entity,
        _ids: ids,
      }),
    ).pipe(map((res) => res.data));
  }

  get mapTiles$(): Observable<Tables<'map_pmtiles'>[]> {
    return from(
      this.supabase
        .from('map_pmtiles')
        .select('*')
        .filter('public', 'eq', true),
    ).pipe(map((res) => res.data as Tables<'map_pmtiles'>[]));
  }

  downloadFile(bucket: string, path: string) {
    return from(this.supabase.storage.from(bucket).download(path)).pipe(
      map((res) => res.data),
    );
  }

  listBucketFiles(bucket: string) {
    return from(this.supabase.storage.from(bucket).list());
  }

  publicImageUrl(
    bucket: string,
    path: string,
    imageSize?: TransformOptions,
  ): string {
    // const { data } = this.supabase
    //   .storage
    //   .from(bucket)
    //   .getPublicUrl(path, {
    //     transform: imageSize,
    //   });

    // return data.publicUrl;

    return `${environment.supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
  }

  get mapIcons$(): Observable<Tables<'map_icon'>[]> {
    return from(this.supabase.from('map_icon').select('*')).pipe(
      map((res) => res.data as Tables<'map_icon'>[]),
    );
  }

  //RPC
  tableAsGeojson(
    table: MapSource,
  ): Observable<FeatureCollection<Point | LineString | Polygon>> {
    return from(this.supabase.rpc('table_as_geojson', { _tbl: table })).pipe(
      map((res: any) => res.data.geojson),
    );
  }

  distanceTo(
    coords: [number, number],
    withinDistance: number,
  ): Observable<EntityDistanceSearchResult[]> {
    return from(
      this.supabase.rpc('distance_to', {
        lng: coords[0],
        lat: coords[1],
        search_radius: withinDistance,
      }),
    ).pipe(map((res) => res.data));
  }

  textSearch(searchTerm: string): Observable<EntityFreeTextSearchResult[]> {
    return from(
      this.supabase
        .rpc('text_search', { search_term: searchTerm })
        .or('rank.gt.0,similarity.gt.0.1')
        .limit(10),
    ).pipe(map((res) => res.data));
  }
}
