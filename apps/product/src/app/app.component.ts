import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import AOS from 'aos';
import { CommonModule } from '@angular/common';

type Feature = {
  title: string;
  bullets: string[];
  backgroundColor?: string;
  color?: string;
  svgPath?: string;
  image: string;
}


@Component({
  standalone: true,
  imports: [NxWelcomeComponent, CommonModule, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  features = signal<Feature[]>([
    {
      title: 'Map',
      bullets: [
        'Interactive zoom to different events',
        'Stage info with timetables',
        'Custom map icons',
        'Tickets & directions'
      ],
      backgroundColor: 'bg-army-600',
      color: 'text-white',
      image: 'assets/map.png',
      svgPath: 'M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z'
    },
    {
      title: 'Timetable',
      bullets: [
        'Liked artists highlighted',
        'Notifications for upcoming artists',
        'Timeline and list view',
        'Tracks current time',
      ],
      backgroundColor: 'bg-primary-400',
      color: 'text-yellow-500',
      image: 'assets/timetable.png',
      svgPath: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
    },
    {
      title: 'Artists',
      bullets: [
        'Favorites',
        'Soundclound and Bandcamp player',
        'Locate artist on map',
        'Share artist'
      ],
      backgroundColor: 'bg-pink-500',
      color: 'text-orange-900',
      image: 'assets/artists.png',
      svgPath: 'M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
    },
    {
      title: 'Others',
      bullets: [
        'Partner branding',
        'Push notifications',
        'Custom pages',
      ],
      backgroundColor: 'bg-green-300',
      color: 'text-army-600',
      image: 'assets/more.png',
      svgPath: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z'
    },
    {
      title: 'Editor',
      bullets: [
        'Edit app content',
        'Upload artist images',
        'Upload map icons'
      ],
      backgroundColor: 'bg-purple-300',
      color: 'text-purple-800',
      image: 'assets/editor.png',
      svgPath: 'm16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125'
    },
    {
      title: 'Analytics',
      bullets: [
        'Get stats on app usage',
        'Liked artists',
        'Feature usage',
      ],
      backgroundColor: 'bg-gray-800',
      color: 'text-white',
      image: 'assets/analytics.png',
      svgPath: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z'
    },
  ])

  copied = signal<boolean>(false);

  ngOnInit(): void {
    AOS.init()
  }

  onCopyMail(): void {

    try {
      const mail = 'blockparty.dev@proton.me';
      navigator.clipboard.writeText(mail);
      this.copied.set(true);
      setTimeout(() => {
        this.copied.set(false);
      }, 2000);
    } catch (error) {
     this.copied.set(false)
    }




  }


}
