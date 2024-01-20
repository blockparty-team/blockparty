import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StagePage } from './stage.page';

describe('StagePage', () => {
  let component: StagePage;
  let fixture: ComponentFixture<StagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
