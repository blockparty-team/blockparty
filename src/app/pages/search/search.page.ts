import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { definitions } from '@app/interfaces/supabase';
import { SearchService } from '@app/services/search.service';
import { pathToImageUrl } from '@app/shared/utils';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPage implements OnInit {

  searchTerm = new FormControl('');

  searchResults$: Observable<any>;
  nearBy$: Observable<any[]>;

  constructor(
    private supabaseService: SupabaseService,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.searchResults$ = this.searchTerm.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => this.supabaseService.searchArtist(term)),
      map(res => res.data),
      tap(console.log)
    );

    this.nearBy$ = this.searchService.nearBy$;
  }

  imgUrl(path: string): string {
    return path ? pathToImageUrl(path) : 'assets/distortion_logo.png';
  }

}
