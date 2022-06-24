import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  searchTerm = new FormControl('');

  searchResults$: Observable<any>;

  constructor(
    private supabaseService: SupabaseService
  ) { }

  ngOnInit() {
    this.searchResults$ = this.searchTerm.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => this.supabaseService.searchArtist(term)),
      map(res => res.data),
      tap(console.log)
    );
  }

}
