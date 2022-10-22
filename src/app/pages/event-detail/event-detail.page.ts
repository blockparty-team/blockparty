import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventViewModel } from '@app/interfaces/event';
import { MapLayer } from '@app/interfaces/map-layer';
import { MapService } from '@app/services/map.service';
import { LngLatBoundsLike } from 'maplibre-gl';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { EventStateService } from '../event/state/event-state.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

  event$: Observable<EventViewModel>

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventStateService: EventStateService,
    private mapService: MapService,
    private router: Router
  ) { }

  ngOnInit() {
    this.event$ = this.activatedRoute.paramMap.pipe(
      map(paramMap => paramMap.get('id')),
      switchMap(id => this.eventStateService.events$.pipe(
        map(events => events.find(event => event.id === id))
      ))
    );
  }

  onZoomToEventOnMap(id: string, bounds: number[]) {
    this.mapService.fitBounds(bounds as LngLatBoundsLike);
    this.mapService.highlightFeature(MapLayer.EventHighLight, id, true);
    this.router.navigate(['/tabs', 'map']);
  }

}
