import { Injectable } from '@angular/core';
import { pathToImageUrl } from '@app/shared/utils';
import { StoreService } from '@app/store/store.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventStateService {

  events$ = this.store.events$.pipe(
    map(events => events.map(event => ({...event, imgUrl: pathToImageUrl(event.storage_path)})))
  )
  
  constructor(
    private store: StoreService
  ) { }

}
