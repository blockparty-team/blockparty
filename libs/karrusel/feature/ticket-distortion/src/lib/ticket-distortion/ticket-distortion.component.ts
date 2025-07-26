import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-ticket-distortion',
  imports: [CommonModule],
  templateUrl: './ticket-distortion.component.html',
  styleUrl: './ticket-distortion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketDistortionComponent {}
