import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ArtistDetailPage } from './artist-detail.page';

describe('ArtistDetailPage', () => {
  let component: ArtistDetailPage;
  let fixture: ComponentFixture<ArtistDetailPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ArtistDetailPage]
}).compileComponents();

    fixture = TestBed.createComponent(ArtistDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
