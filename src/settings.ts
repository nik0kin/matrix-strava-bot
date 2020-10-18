export interface Settings {
  //// SETUP ////

  /**
   * Matrix Homeserver
   *  Eg. "https://matrix-federation.matrix.org"
   */
  homeserverUrl: string;
  /**
   * Access Token of the bot account
   *   See https://t2bot.io/docs/access_tokens/ for a simple way to generate
   */
  matrixAccessToken: string;
  /**
   * Strava API Application Client ID
   *   Found at https://www.strava.com/settings/api
   */
  stravaClientId: string;
  /**
   * Strava API Application Client Secret
   */
  stravaClientSecret: string;
  /**
   * Strava API Application Access Token
   *   The bot will refresh the token when appropriate and store it in bot-storage.json
   */
  stravaAccessToken: string;
  /**
   * Strava API Application Refresh Token
   */
  stravaRefreshToken: string;
  /**
   * Strava Club ID, also known as "Vanity Club URL"
   *   Eg. For the url https://www.strava.com/clubs/YOUR-ID-HERE -> YOUR-ID-HERE
   */
  stravaClub: string;
  /**
   * File used as temporary storage by the bot
   *   Defaults to `bot-storage.json`
   */
  storageFile?: string;

  //// OPERATIONS ////

  /**
   * Dry run indicates that no messages will be sent to Matrix
   *   Defaults to `false`
   */
  dryRun?: boolean;
  /**
   * Frequency of the bot polling Strava's API (in seconds)
   */
  pollFrequency: number;
  /**
   * Should the bot auto accept invites to rooms?
   *    (Probably not if you want your Strava Club private)
   *   Defaults to `false`
   */
  autoJoin?: boolean;

  //// CUSTOMIZATION ////

  /**
   * Include emoji's in the club activity message
   */
  emoji: boolean;
  /**
   * Optional Message outputted on bot startup and joining rooms
   */
  onBotJoinRoomMessage: string | undefined;
  /**
   * Display the club activity message in miles
   *   Defaults to `false`
   */
  useMiles?: boolean;
  /**
   * Display club activity elevation
   *   Defaults to `true`
   */
  includeElevation?: boolean;
  /**
   * Display club activity average speed (distance/moving_time)
   *   Defaults to `true`
   */
  includeSpeed?: boolean;
}

export type SettingsWithDefaults = Required<Settings>;
