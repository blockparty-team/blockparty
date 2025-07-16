import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EventTableComponent } from './event-table.component';

describe('EventTableComponent', () => {
  let component: EventTableComponent;
  let fixture: ComponentFixture<EventTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), EventTableComponent],
}).compileComponents();

    fixture = TestBed.createComponent(EventTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
