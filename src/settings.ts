export interface Settings {
  homeserverUrl: string;
  accessToken: string;
  stravaAccessToken: string;
  stravaClub: string;
  pollFrequency: number; // In seconds
  emoji: boolean;
  links: boolean;
  onBotJoinRoomMessage: string;
}
