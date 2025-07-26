import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-ticket-karrusel',
  imports: [CommonModule],
  templateUrl: './ticket-karrusel.component.html',
  styleUrl: './ticket-karrusel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketKarruselComponent {}
