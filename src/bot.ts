/* eslint-disable no-console */
import { MatrixClient } from 'matrix-bot-sdk';

import { getClubActivityString } from './message-formatter';
import { Settings } from './settings';
import { createMatrixClient, sendMessageToAllJoinedRooms } from './matrix-bot';
import { ClubActivity, listStravaClubActivities } from './strava';

const PER_PAGE = 30;

async function poll(settings: Settings, botClient: MatrixClient) {
  try {
    await checkForRecentActivities(settings, botClient);
  } catch (e) {
    console.error('Something went wrong polling', e);
  }
  setTimeout(() => {
    poll(settings, botClient);
  }, settings.pollFrequency * 1000);
}

let lastClubActivitiesData: ClubActivity[] = [];

async function checkForRecentActivities(settings: Settings, botClient: MatrixClient) {
  let data: ClubActivity[];
  try {
    data = await listStravaClubActivities({ id: settings.stravaClub, per_page: PER_PAGE, access_token: settings.stravaAccessToken });
  } catch (e) {
    throw new Error('List Strava Club Activities API error: ' + JSON.stringify(e));
  }

  console.log('checkForRecentActivities');
  const activitiesMessage = data
    .filter((a) => !hasBeenReported(a))
    .map((a) => getClubActivityString(a, settings)).join('\n');
  if (!activitiesMessage) {
    return;
  }
  console.log(activitiesMessage);
  if (!settings.dryRun) {
    sendMessageToAllJoinedRooms(botClient, activitiesMessage);
  }
  lastClubActivitiesData = data;
  botClient.storageProvider.storeValue('lastClubActivitiesData', JSON.stringify(data));
}


export async function startPoll(settings: Settings) {
  const botClient = createMatrixClient(settings);

  await botClient.start();

  console.log(settings.onBotJoinRoomMessage || 'onBotJoinRoomMessage');

  if (settings.onBotJoinRoomMessage && !settings.dryRun) {
    sendMessageToAllJoinedRooms(botClient, settings.onBotJoinRoomMessage);

    botClient.on('room.join', (roomId: string) => {
      botClient.sendText(roomId, settings.onBotJoinRoomMessage);
    });
  }

  const result = botClient.storageProvider.readValue('lastClubActivitiesData');
  if (typeof result === 'string') {
    lastClubActivitiesData = JSON.parse(result);
  } else if (result && (result as any).then) {
    lastClubActivitiesData = JSON.parse(await (result as Promise<string>));
  } else {
    lastClubActivitiesData = [];
  }

  poll(settings, botClient);
}

function hasBeenReported(activity: ClubActivity) {
  const stringifiedActivities = lastClubActivitiesData.map((a) => JSON.stringify(a));
  return stringifiedActivities.includes(JSON.stringify(activity));
}
