import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketsPage } from './tickets.page';

describe('TicketPageComponent', () => {
  let component: TicketsPage;
  let fixture: ComponentFixture<TicketsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
