import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EventViewModel } from '@app/interfaces/event';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-event-card',
    templateUrl: './event-card.component.html',
    styleUrls: ['./event-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [IonicModule, RouterLink, NgIf]
})
export class EventCardComponent {
  @Input() event: EventViewModel
}
