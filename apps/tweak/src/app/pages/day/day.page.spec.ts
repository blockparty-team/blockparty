import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DayPage } from './day.page';

describe('DayPage', () => {
  let component: DayPage;
  let fixture: ComponentFixture<DayPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
