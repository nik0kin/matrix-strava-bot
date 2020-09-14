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
  storageFile?: string;
  pollFrequency: number; // In seconds
  autoJoin: boolean;
  emoji: boolean;
  links: boolean;
  onBotJoinRoomMessage: string;
  useMiles: boolean;

  //// Debug ////
  dryRun: boolean;
}
