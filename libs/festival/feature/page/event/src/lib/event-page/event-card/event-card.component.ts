import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EventViewModel } from '@blockparty/festival/shared/types';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonCard, IonBadge, IonRouterLink } from '@ionic/angular/standalone';

@Component({
    selector: 'app-event-card',
    templateUrl: './event-card.component.html',
    styleUrls: ['./event-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, NgIf, IonCard, IonBadge, IonRouterLink]
})
export class EventCardComponent {
  @Input() event!: EventViewModel;
}
