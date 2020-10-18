import strava, { ClubActivity } from 'strava-v3';

import { Settings } from './settings';

export function setupStrava(settings: Settings) {
  strava.config({
    access_token: settings.stravaAccessToken,
    client_id: settings.stravaClientId,
    client_secret: settings.stravaClientSecret,
    redirect_uri: '', // We don't need this since we aren't sending user's through oauth
  });
}

export function listStravaClubActivities(args: any): Promise<ClubActivity[]> {
  return new Promise((resolve, reject) => {
    // typing lies: doesnt support promises
    strava.clubs.listActivities(args, (err, data) => {
      if (err) {
        return reject(err);
      }
      // Remove workout_type to make caching simpler (workout_type changes from undefined to null on a user updating their activity)
      const dataWithoutWorkoutType = (data as ClubActivity[]).map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ workout_type, ...rest }) => rest
      );
      resolve(dataWithoutWorkoutType);
    });
  });
}

export interface RefreshTokenResponse {
  token_type: string;
  access_token: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
}
