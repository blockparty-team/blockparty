import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EventMapComponent } from './event-map.component';

describe('EventMapComponent', () => {
  let component: EventMapComponent;
  let fixture: ComponentFixture<EventMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), EventMapComponent],
}).compileComponents();

    fixture = TestBed.createComponent(EventMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
