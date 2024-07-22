import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventPage } from './event.page';

describe('EventPageComponent', () => {
  let component: EventPage;
  let fixture: ComponentFixture<EventPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventPage],
    }).compileComponents();

    fixture = TestBed.createComponent(EventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
