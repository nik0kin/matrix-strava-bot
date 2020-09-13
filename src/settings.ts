export interface Settings {
  homeserverUrl: string;
  matrixAccessToken: string;
  stravaClientId: string;
  stravaClientSecret: string;
  stravaAccessToken: string;
  stravaRefreshToken: string;
  stravaClub: string;
  pollFrequency: number; // In seconds
  emoji: boolean;
  links: boolean;
  onBotJoinRoomMessage: string;
  dryRun: boolean;
}
