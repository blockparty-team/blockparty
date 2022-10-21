import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventViewModel } from '@app/interfaces/event';
import { pathToImageUrl } from '@app/shared/utils';
import { StoreService } from '@app/store/store.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  events$: Observable<EventViewModel[]>;

  constructor(
    private store: StoreService,
    private router: Router
  ) { }

  ngOnInit() {
    this.events$ = this.store.events$;
  }

  onGoToEvent(eventId: string) {
    this.router.navigate(['/event', eventId]);
  }

  imgUrl(path: string): string {
    return pathToImageUrl(path);
  }

}
