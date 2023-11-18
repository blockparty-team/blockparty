import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EventViewModel } from '@app/interfaces/event';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonCard, IonBadge } from "@ionic/angular/standalone";

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, NgIf, IonCard, IonBadge]
})
export class EventCardComponent {
  @Input() event: EventViewModel;
}
