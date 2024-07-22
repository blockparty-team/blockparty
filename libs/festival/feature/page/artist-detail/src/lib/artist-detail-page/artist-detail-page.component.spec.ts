import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArtistDetailPage } from './artist-detail.page';

describe('ArtistDetailPageComponent', () => {
  let component: ArtistDetailPage;
  let fixture: ComponentFixture<ArtistDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
