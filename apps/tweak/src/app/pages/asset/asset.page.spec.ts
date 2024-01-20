import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetPage } from './asset.page';

describe('AssetPage', () => {
  let component: AssetPage;
  let fixture: ComponentFixture<AssetPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AssetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
