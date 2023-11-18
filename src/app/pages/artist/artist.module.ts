import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ArtistPageRoutingModule } from './artist-routing.module';

import { ArtistPage } from './artist.page';
import { ArtistCardComponent } from './artist-card/artist-card.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ScrollingModule,
        ArtistPageRoutingModule,
        ArtistPage, ArtistCardComponent
    ]
})
export class ArtistPageModule { }
