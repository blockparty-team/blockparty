import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArtistPage } from './artist.page';

describe('ArtistPage', () => {
  let component: ArtistPage;
  let fixture: ComponentFixture<ArtistPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ArtistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
