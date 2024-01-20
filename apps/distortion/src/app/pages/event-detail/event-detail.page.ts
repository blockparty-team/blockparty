import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
import { LngLatBoundsLike } from 'maplibre-gl';
import { MapService } from '@app/services/map.service';
import { EventStateService } from '../event/state/event-state.service';
import { EventViewModel } from '@app/interfaces/event';
import { MapLayer } from '@app/interfaces/map-layer';
import { environment } from '@shared/environments';
import { RouteName } from '@app/shared/models/routeName';
import { ModalController } from '@ionic/angular/standalone';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonBadge,
  IonModal,
  IonButton,
  IonList,
  IonItem,
  IonRouterLink,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    RouterLink,
    AsyncPipe,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonBadge,
    IonModal,
    IonButton,
    IonList,
    IonItem,
    IonRouterLink,
  ],
})
export class EventDetailPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private modalCtrl = inject(ModalController);
  private eventStateService = inject(EventStateService);
  private mapService = inject(MapService);
  private router = inject(Router);

  routeName = RouteName;

  event$: Observable<EventViewModel>;
  canShare$ = from(Share.canShare()).pipe(map((res) => res.value));

  ngOnInit() {
    this.event$ = this.activatedRoute.paramMap.pipe(
      map((paramMap) => paramMap.get('id')),
      switchMap((id) =>
        this.eventStateService.events$.pipe(
          map((events) => events.find((event) => event.id === id))
        )
      )
    );
  }

  onZoomToEventOnMap(id: string, bounds: number[]) {
    this.router.navigate(['/tabs', RouteName.Map]);
    this.mapService.fitBounds(bounds as LngLatBoundsLike);
    this.mapService.highlightFeature(MapLayer.EventHighLight, id, true);
  }

  share(event: EventViewModel): void {
    Share.canShare().then((canShare) => {
      if (canShare.value) {
        Share.share({
          dialogTitle: `${event.name}`,
          title: 'Share',
          text: `Check out ${event.name} event at ${
            environment.festivalName
          } running ${event.days.join(' and ')}`,
          url: `${environment.appUrl}${this.router.url}`,
        });
      }
    });
  }

  onGoToTicket(ticketUrl: string): void {
    Browser.open({
      url: ticketUrl,
    });
  }

  onCloseModal(): void {
    this.modalCtrl.dismiss();
  }
}
