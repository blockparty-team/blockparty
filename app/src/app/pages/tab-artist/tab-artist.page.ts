import { Component, OnInit } from '@angular/core';
import { pathToImageUrl } from '@app/shared/utils';
import { Observable } from 'rxjs';
import { SupabaseService } from '@app/services/supabase.service';
import { definitions } from '@app/interfaces/supabase';

@Component({
  selector: 'app-tab-artist',
  templateUrl: './tab-artist.page.html',
  styleUrls: ['./tab-artist.page.scss'],
})
export class TabArtistPage implements OnInit {

  artists$: Observable<definitions['artist'][]>;

  constructor(
    private supabaseService: SupabaseService
  ) { }

  ngOnInit() {
    this.artists$ = this.supabaseService.artists$;
  }

  imgUrl(path: string): string {
    return pathToImageUrl(path);
  }

}
