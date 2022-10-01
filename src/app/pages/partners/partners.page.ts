import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.page.html',
  styleUrls: ['./partners.page.scss'],
})
export class PartnersPage implements AfterViewInit {

  @ViewChild('video') video: ElementRef<HTMLVideoElement>

  constructor() { }

  ngAfterViewInit(): void {
    this.video.nativeElement.play();
  }

}
