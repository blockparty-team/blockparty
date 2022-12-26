import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EventViewModel } from '@app/interfaces/event';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventCardComponent {
  @Input() event: EventViewModel
}
