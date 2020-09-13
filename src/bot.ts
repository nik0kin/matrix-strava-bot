/* eslint-disable no-console */
import { MatrixClient } from 'matrix-bot-sdk';
import strava from 'strava-v3';

import { getClubActivityString } from './message-formatter';
import { Settings } from './settings';
import { createMatrixClient, sendMessageToAllJoinedRooms } from './matrix-bot';
import { ClubActivity } from './strava';

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
  // typing lies: doesnt support promises
  strava.clubs.listActivities({ id: settings.stravaClub, per_page: PER_PAGE, access_token: settings.stravaAccessToken }, (err, data: ClubActivity[]) => {
    if (err) {
      console.log('checkForRecentActivities error: ', err);
      return;
    }
    console.log('checkForRecentActivities');
    const activitiesMessage = data
      .filter((a) => {
        return !lastClubActivitiesData.map((a) => JSON.stringify(a)).includes(JSON.stringify(a)); // TODO cleanup
      })
      .map((a) => getClubActivityString(a)).join('\n');
    console.log(activitiesMessage);
    if (!settings.dryRun) {
      sendMessageToAllJoinedRooms(botClient, activitiesMessage);
    }
    lastClubActivitiesData = data;
    botClient.storageProvider.storeValue('lastClubActivitiesData', JSON.stringify(data));
  });
}


export function startPoll(settings: Settings) {
  const botClient = createMatrixClient(settings);

  botClient.start()
    .then(async () => {
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
    });
}
