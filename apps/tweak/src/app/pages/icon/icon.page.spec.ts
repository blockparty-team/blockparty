import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconPage } from './icon.page';

describe('IconPage', () => {
  let component: IconPage;
  let fixture: ComponentFixture<IconPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IconPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
