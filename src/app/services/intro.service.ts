import { Injectable } from '@angular/core';
import * as Driver from 'driver.js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IntroService {
  driver = new Driver({
    animate: false,
    padding: 0
  });

  constructor(
    private router: Router
  ) { }

  defaultStepOptions = {
    classes: 'intro',
    scrollTo: true,
    cancelIcon: {
      enabled: true
    }
  };

  mapPage() {

    this.driver.defineSteps([
      {
        element: '#intro-step-1',
        popover: {
          title: 'Find events on map',
          description: 'Find events on map by selecting days and events here',
          position: 'bottom-center'
        },
        onNext: () => {
          this.router.navigate(['tabs', 'artist']);
        }
      },
      {
        element: '#intro-step-2',
        popover: {
          title: 'Meno',
          description: 'Find events on map by selecting days and events here',
          position: 'center'
        },
        onPrevious: () => this.router.navigate(['tabs', 'map'])

      }
    ])

    this.driver.start();

  }
}
