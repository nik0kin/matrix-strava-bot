import strava from 'strava-v3';

import { Settings } from './settings';

export function setupStrava(settings: Settings) {
  strava.config({
    "access_token": settings.accessToken,
    "client_id": "Your apps Client ID (Required for oauth)",
    "client_secret": "Your apps Client Secret (Required for oauth)",
    "redirect_uri": "Your apps Authorization Redirection URI (Required for oauth)",
  });
}
