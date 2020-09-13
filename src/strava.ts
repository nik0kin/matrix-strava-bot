import strava from 'strava-v3';

import { Settings } from './settings';

export function setupStrava(settings: Settings) {
  strava.config({
    'access_token': settings.stravaAccessToken,
    'client_id': settings.stravaClientId,
    'client_secret': settings.stravaClientSecret,
    'redirect_uri': '', // We don't need this since we aren't sending user's through oauth
  });
}

export interface ClubActivity {
  resource_state: number,
  athlete: { resource_state: number, firstname: string, lastname: string },
  name: string,
  distance: number,
  moving_time: number,
  elapsed_time: number,
  total_elevation_gain: number,
  type: string,
  workout_type: any
}

export function listStravaClubActivities(args: any): Promise<ClubActivity[]> {
  return new Promise((resolve, reject) => {
    // typing lies: doesnt support promises
    strava.clubs.listActivities(args, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
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
