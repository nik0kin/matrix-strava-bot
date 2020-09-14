import { MatrixClient, SimpleFsStorageProvider } from 'matrix-bot-sdk';
import strava from 'strava-v3';

import { Settings } from './settings';
import { RefreshTokenResponse } from './strava';

const accessTokenKey = 'stravaAccessToken';
const accessTokenExpiresAtKey = 'stravaAccessTokenExpiresAt';
const refreshTokenKey = 'refreshTokenKey';

export async function refreshStravaAccessToken(settings: Settings, botClient: MatrixClient) {
  // The current accessToken will be returned if it's not expired yet
  const data: RefreshTokenResponse = await strava.oauth.refreshToken(getStravaRefreshToken(settings, botClient));
  botClient.storageProvider.storeValue(accessTokenKey, data.access_token);
  botClient.storageProvider.storeValue(accessTokenExpiresAtKey, String(data.expires_at));
  botClient.storageProvider.storeValue(refreshTokenKey, data.refresh_token);
}

export function getStravaAccessToken(settings: Settings, botClient: MatrixClient) {
  const result = (botClient.storageProvider as SimpleFsStorageProvider).readValue(accessTokenKey);
  return typeof result === 'string'
    ? result
    : settings.stravaAccessToken;
}

export function getStravaRefreshToken(settings: Settings, botClient: MatrixClient) {
  const result = (botClient.storageProvider as SimpleFsStorageProvider).readValue(refreshTokenKey);
  return typeof result === 'string'
    ? result
    : settings.stravaRefreshToken;
}

// shouldn't be used until `refreshStravaAccessToken()` has been called
export function getStravaAccessTokenExpiresAt(botClient: MatrixClient) {
  return Number((botClient.storageProvider as SimpleFsStorageProvider).readValue(accessTokenExpiresAtKey));
}
