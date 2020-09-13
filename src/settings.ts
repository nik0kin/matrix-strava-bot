export interface Settings {
  homeserverUrl: string;
  matrixAccessToken: string;
  stravaAccessToken: string;
  stravaClub: string;
  pollFrequency: number; // In seconds
  emoji: boolean;
  links: boolean;
  onBotJoinRoomMessage: string;
  dryRun: boolean;
}
