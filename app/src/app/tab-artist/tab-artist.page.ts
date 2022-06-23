import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-tab-artist',
  templateUrl: './tab-artist.page.html',
  styleUrls: ['./tab-artist.page.scss'],
})
export class TabArtistPage implements OnInit {

  artists$: Observable<any>;

  constructor(
    private supabaseService: SupabaseService
  ) { }

  ngOnInit() {
    this.artists$ = this.supabaseService.artists$;
  }

}
