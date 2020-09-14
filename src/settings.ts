export interface Settings {
  //// Matrix ////
  homeserverUrl: string;
  matrixAccessToken: string;
  //// Strava ////
  stravaClientId: string;
  stravaClientSecret: string;
  stravaAccessToken: string;
  stravaRefreshToken: string;
  stravaClub: string;
  //// Bot settings ////
  autoJoin: boolean;
  pollFrequency: number; // In seconds
  emoji: boolean;
  links: boolean;
  onBotJoinRoomMessage: string;
  useMiles: boolean;

  //// Debug ////
  dryRun: boolean;
}
