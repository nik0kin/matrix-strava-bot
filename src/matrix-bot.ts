import { MatrixClient, SimpleFsStorageProvider, AutojoinRoomsMixin } from 'matrix-bot-sdk';
import { Settings } from './settings';

export function createMatrixClient(settings: Settings) {
  const storage = new SimpleFsStorageProvider('bot-storage.json');
  const client = new MatrixClient(settings.homeserverUrl, settings.accessToken, storage);
  AutojoinRoomsMixin.setupOnClient(client);
  return client;
}

export function sendMessageToAllJoinedRooms(client: MatrixClient, message: string, htmlFormattedMessage?: string) {
  client.getJoinedRooms()
    .then((rooms) => {
      rooms.forEach((roomId) => {
        client.sendMessage(roomId, {
          msgtype: 'm.text',
          body: message,
          ...(htmlFormattedMessage ? {
            format: 'org.matrix.custom.html',
            formatted_body: htmlFormattedMessage
          } : {})
        });
      });
    });
}
