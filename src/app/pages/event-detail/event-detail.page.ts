import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventViewModel } from '@app/interfaces/event';
import { pathToImageUrl } from '@app/shared/utils';
import { StoreService } from '@app/store/store.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

  event$: Observable<EventViewModel>

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: StoreService
  ) { }

  ngOnInit() {
    this.event$ = this.activatedRoute.paramMap.pipe(
      map(paramMap => paramMap.get('id')),
      switchMap(id => this.store.events$.pipe(
        map(events => events.find(event => event.id === id))
      ))
    );
  }
  
  imgUrl(path: string): string {
    return pathToImageUrl(path);
  }
}
