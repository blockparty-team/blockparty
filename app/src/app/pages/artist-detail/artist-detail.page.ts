import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistWithRelations } from '@app/interfaces/artist';
import { definitions } from '@app/interfaces/supabase';
import { SupabaseService } from '@app/services/supabase.service';
import { pathToImageUrl } from '@app/shared/utils';
import { StoreService } from '@app/store/store.service';
import { Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.page.html',
  styleUrls: ['./artist-detail.page.scss'],
})
export class ArtistDetailPage implements OnInit {

  // artist$: Observable<definitions['artist']> = this.activatedRoute.paramMap.pipe(
  //   map(paramMap => paramMap.get('id')),
  //   switchMap(id => this.supabaseService.artist(id)),
  //   tap(console.log)
  // );

  artist$: Observable<ArtistWithRelations> = this.activatedRoute.paramMap.pipe(
    map(paramMap => paramMap.get('id')),
    switchMap(id => this.store.artists$.pipe(
      map(artists => artists.find(artist => artist.id === id))
    )),
    tap(console.log)
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: StoreService,
    private supabaseService: SupabaseService
  ) { }

  ngOnInit() {
  }

  imgUrl(path: string): string {
    return path ? pathToImageUrl(path) : 'assets/distortion_logo.png';
  }

}
