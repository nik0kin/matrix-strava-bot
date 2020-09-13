/* eslint-disable no-console */
import { MatrixClient } from 'matrix-bot-sdk';
import strava from 'strava-v3';

import { getShopItemString } from './message-formatter';
import { Settings } from './settings';
import { createMatrixClient, sendMessageToAllJoinedRooms } from './matrix-bot';
import { setupStrava } from './strava';

// let lastFeaturedShopItems: [ShopItem, ShopItem, ShopItem];
let lastTimeChecked: string;

async function poll(settings: Settings, botClient?: MatrixClient) {
  try {
    await checkForRecentActivities(settings, botClient);
  } catch (e) {
    console.error('Something went wrong polling', e);
  }
  setTimeout(() => {
    poll(settings, botClient);
  }, settings.pollFrequency * 1000);
}

async function checkForRecentActivities(settings: Settings, botClient?: MatrixClient) {
  // typing lies: doesnt support promises
  strava.clubs.listActivities({ id: settings.stravaClub }, (data) => {
    console.log('checkForRecentActivities', data);
  });
  // lastTimeChecked = now
}


export function startPoll(settings: Settings) {
  setupStrava(settings);
  // const botClient = createMatrixClient(settings);

  // botClient.start()
  //   .then(() => {
  //     console.log(settings.onBotJoinRoomMessage || 'onBotJoinRoomMessage');

  //     if (settings.onBotJoinRoomMessage) {
  //       sendMessageToAllJoinedRooms(botClient, settings.onBotJoinRoomMessage);

  //       botClient.on('room.join', (roomId: string) => {
  //         botClient.sendText(roomId, settings.onBotJoinRoomMessage);
  //       });
  //     }
  //     poll(settings, botClient);
  //   });
  poll(settings);
}
