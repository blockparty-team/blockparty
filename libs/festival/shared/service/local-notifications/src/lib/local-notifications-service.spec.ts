import { describe, expect, it } from 'vitest';
import { ArtistNotification } from '@blockparty/festival/data-access/supabase';

import { LocalNotificationsService } from './local-notifications-service';

describe('LocalNotificationsService', () => {
  const service = new LocalNotificationsService();
  const now = new Date('2026-08-10T10:00:00.000Z');

  const createArtistNotification = (startTime: string): ArtistNotification => ({
    artistId: 'artist-1',
    artistName: 'Test Artist',
    startTime: new Date(startTime),
    stageName: 'Main',
    eventName: 'Festival',
  });

  it('allows scheduling when the notification time is still in the future', () => {
    const artistNotification = createArtistNotification(
      '2026-08-10T11:30:00.000Z',
    );

    expect(
      service.shouldScheduleArtistNotification(artistNotification, 60, now),
    ).toBe(true);
  });

  it('skips scheduling when less than one hour remains before the artist starts', () => {
    const artistNotification = createArtistNotification(
      '2026-08-10T10:30:00.000Z',
    );

    expect(
      service.shouldScheduleArtistNotification(artistNotification, 60, now),
    ).toBe(false);
  });

  it('skips scheduling when the artist has already started', () => {
    const artistNotification = createArtistNotification(
      '2026-08-10T09:30:00.000Z',
    );

    expect(
      service.shouldScheduleArtistNotification(artistNotification, 60, now),
    ).toBe(false);
  });
});
