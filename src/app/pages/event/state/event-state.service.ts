import { Injectable } from '@angular/core';
import { EventViewModel } from '@app/interfaces/event';
import { pathToImageUrl } from '@app/shared/utils';
import { StoreService } from '@app/store/store.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventStateService {

  events$: Observable<EventViewModel[]> = this.store.events$.pipe(
    map(events => events.map(event => {
      // Make artist and day root properties
      const {day_event, stage, ...rest} = event
      return {
        ...rest,
        artists: stage
          .flatMap(stage => stage.timetable.map(t => t.artist))
          .sort((a, b) =>  a.name.localeCompare(b.name)),
        days: day_event.map(day => day.day.name)
      }
    })),
    map(events => events.map(event => ({ ...event, imgUrl: pathToImageUrl(event.storage_path) })))
  )

  constructor(
    private store: StoreService
  ) { }

}
