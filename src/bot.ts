/* eslint-disable no-console */
import { MatrixClient, SimpleFsStorageProvider } from 'matrix-bot-sdk';
import { ClubActivity } from 'strava-v3';

import { getClubActivityString } from './message-formatter';
import { Settings, SettingsWithDefaults } from './settings';
import { createMatrixClient, sendMessageToAllJoinedRooms } from './matrix-bot';
import { listStravaClubActivities, setupStrava } from './strava';
import {
  getStravaAccessTokenExpiresAt,
  refreshStravaAccessToken,
  getStravaAccessToken,
} from './strava-auth';

const PER_PAGE = 30;

async function poll(settings: SettingsWithDefaults, botClient: MatrixClient) {
  if (getStravaAccessTokenExpiresAt(botClient) < Date.now()) {
    console.log('Refreshing token');
    try {
      await refreshStravaAccessToken(settings, botClient);
    } catch (e) {
      console.error('Could not refresh access token when needed', e);
      setPollTimeout(settings, botClient);
      return;
    }
  }

  try {
    await checkForRecentActivities(settings, botClient);
  } catch (e) {
    console.error('Something went wrong polling', e);
  }
  setPollTimeout(settings, botClient);
}

function setPollTimeout(
  settings: SettingsWithDefaults,
  botClient: MatrixClient
) {
  setTimeout(() => {
    poll(settings, botClient);
  }, settings.pollFrequency * 1000);
}

let lastClubActivitiesData: ClubActivity[] = [];

async function checkForRecentActivities(
  settings: SettingsWithDefaults,
  botClient: MatrixClient
) {
  let data: ClubActivity[];
  try {
    data = await listStravaClubActivities({
      id: settings.stravaClub,
      per_page: PER_PAGE,
      access_token: getStravaAccessToken(settings, botClient),
    });
  } catch (e) {
    throw new Error(
      'List Strava Club Activities API error: ' + JSON.stringify(e)
    );
  }

  console.log('checkForRecentActivities');
  const activitiesMessage = data
    .filter((a) => !hasBeenReported(a))
    .map((a) => getClubActivityString(a, settings))
    .join('\n');
  if (!activitiesMessage) {
    return;
  }
  console.log(activitiesMessage);
  if (!settings.dryRun) {
    sendMessageToAllJoinedRooms(botClient, activitiesMessage);
  }
  lastClubActivitiesData = data;
  botClient.storageProvider.storeValue(
    'lastClubActivitiesData',
    JSON.stringify(data)
  );
}

/**
 * Starts the Matrix bot and refreshes the Strava accessToken
 */
export async function startBot(userSettings: Settings) {
  const settings: SettingsWithDefaults = {
    storageFile: 'bot-storage.json',
    dryRun: false,
    autoJoin: false,
    useMiles: false,
    includeSpeed: true,
    includeElevation: true,
    ...userSettings,
  };

  // Connect to Matrix
  const botClient = createMatrixClient(settings);
  await botClient.start();

  // Send startup message
  console.log(settings.onBotJoinRoomMessage || 'onBotJoinRoomMessage');
  if (settings.onBotJoinRoomMessage && !settings.dryRun) {
    sendMessageToAllJoinedRooms(botClient, settings.onBotJoinRoomMessage);

    botClient.on('room.join', (roomId: string) => {
      botClient.sendText(roomId, settings.onBotJoinRoomMessage!);
    });
  }

  setupStrava(settings);

  // Load Last Activities from storage
  const result = (botClient.storageProvider as SimpleFsStorageProvider).readValue(
    'lastClubActivitiesData'
  );
  if (typeof result === 'string') {
    lastClubActivitiesData = JSON.parse(result);
  } else {
    lastClubActivitiesData = [];
  }

  // Check/Refresh access token
  try {
    await refreshStravaAccessToken(settings, botClient);
  } catch (e) {
    throw new Error(
      'Could not refresh Strava token on startup. Is settings.stravaRefreshToken set? ' +
        JSON.stringify(e)
    );
  }

  poll(settings, botClient);
}

function hasBeenReported(activity: ClubActivity) {
  const stringifiedActivities = lastClubActivitiesData.map((a) =>
    JSON.stringify(a)
  );
  return stringifiedActivities.includes(JSON.stringify(activity));
}
