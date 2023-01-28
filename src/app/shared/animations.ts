import { trigger, transition, animate, style } from '@angular/animations';

export const animations = {
    slideInOut: [
        trigger('slideInOut', [
            transition(':enter', [
                style({ transform: 'translateY(-100%)' }),
                animate('200ms ease-in', style({ transform: 'translateY(0%)' }))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ transform: 'translateY(-100%)' }))
            ])
        ])
    ],
    slideLeft: [
        trigger('slideLeft', [
            transition(':enter', [
                style({ transform: 'translateX(0%)' }),
                animate('200ms ease-in', style({ transform: 'translateX(-50%)' }))
            ])
        ])
    ],
    fadeInOut: [
        trigger('fadeInOut', [
            transition(':enter', [
              style({ opacity: 0 }),
              animate(600, style({ opacity: 1 }))
            ]),
            transition('* => void', [
              animate(600, style({ opacity: 0 }))
            ])
          ])
    ],
    slideUpDown: [
        trigger('slideUpDown', [
            transition(':enter', [
                style({ transform: 'translateY(100%)' }),
                animate('200ms ease-in', style({ transform: 'translateY(0%)' }))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ transform: 'translateY(100%)' }))
            ])
        ])
    ],
}