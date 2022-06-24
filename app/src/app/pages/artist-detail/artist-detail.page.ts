import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { definitions } from '@app/interfaces/supabase';
import { SupabaseService } from '@app/services/supabase.service';
import { pathToImageUrl } from '@app/shared/utils';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.page.html',
  styleUrls: ['./artist-detail.page.scss'],
})
export class ArtistDetailPage implements OnInit {

  artist$: Observable<definitions['artist']> = this.activatedRoute.paramMap.pipe(
    map(paramMap => paramMap.get('id')),
    switchMap(id => this.supabaseService.artist(id)),
    tap(console.log)
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private supabaseService: SupabaseService
  ) { }

  ngOnInit() {
  }

  imgUrl(path: string): string {
    return pathToImageUrl(path);
  }

}
