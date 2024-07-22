import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimetablePage } from './timetable.page';

describe('TimetablePageComponent', () => {
  let component: TimetablePage;
  let fixture: ComponentFixture<TimetablePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimetablePage],
    }).compileComponents();

    fixture = TestBed.createComponent(TimetablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
