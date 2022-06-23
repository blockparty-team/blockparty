import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.page.html',
  styleUrls: ['./artist-detail.page.scss'],
})
export class ArtistDetailPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
