export type SpeedUnit = 'mph' | 'min/mi' | 'kmph' | 'min/km';

export interface WeatherSearchLocation {
  q?: string; // See https://www.weatherapi.com/docs/#intro-request `q`
  coordinate?: [number, number];
}

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
   * Display club activity elevation
   *   Defaults to `true`
   */
  includeElevation?: boolean;
  /**
   * Display club activity average speed (distance/moving_time)
   *   Defaults to `true`
   */
  includeSpeed?: boolean;
  /**
   * Display the club activity distance in miles or kilometers
   *   Defaults to `kilometer`
   */
  distanceUnit?: 'mile' | 'kilometer';
  /**
   * Display the club activity speed unit in `mph`, min/mi`, `kmph` or `min/km`
   *   Defaults to `kmph`
   */
  speedUnitDefault?: SpeedUnit;
  /**
   * Override the speed unit for a given activity type.
   *    Eg. { "Walk": "kmph" } to show all walking activities in `kmph`, and `speedUnitDefault` for all other activities
   *    See http://developers.strava.com/docs/reference/#api-models-ActivityType for a list of types
   *   Defaults to `{}` (no overrides)
   */
  speedUnitPerActivity?: Record<string, SpeedUnit>;
  /**
   * Display the a guesstimate of club activity starting time.
   *   Defaults to off
   *
   * Timezone parameter's must be IANA timezones like "America/Chicago"
   *   See more at https://www.iana.org/time-zones or https://github.com/dmfilipenko/timezones.json/blob/master/timezones.json
   */
  includeStartingTime:
    | {
        /**
         * Timezone to show the activity starting time relative to
         */
        timezoneDefault: string;
        /**
         * Override the timezone for a given club member. If set to null, the starting time won't be shown for the member's activities.
         *    Eg. { "Kingo T.": "America/Los_Angeles" } to show the starting time of all Kingo T's relative to Los Angeles time, and `timezoneDefault` for all other club members
         *   Defaults to `{}` (no overrides)
         */
        timezonePerMember?: Record<string, string | null>;
        /**
         * Use military time for starting time string. Eg. 05:00
         *   Defaults to `false`
         */
        militaryTime?: boolean;
      }
    | undefined;
  /**
   * Display the temperature during the guesstimate of club activity starting time.
   *   Defaults to off
   *
   * `weatherApiDotComApiKey` or `getTemperature` must be set
   */
  includeTemp:
    | {
        /**
         * Api Key for Weather API
         *
         * Uses an external service (other than strava)
         *   Get api key at https://www.weatherapi.com/
         */
        weatherApiDotComApiKey?: string;
        /**
         * Display the club activity temperature in metric (C) or imperial (F)
         *   Defaults to `metric`
         */
        unit: 'imperial' | 'metric';
        /**
         * Location to look up the temperature for activities
         */
        locationDefault: WeatherSearchLocation;
        /**
         * Override the location for a given club member. If set to null, the temperature won't be shown for the member's activities.
         *    Eg. { "Kingo T.": { coordinates: [34.0522,-118.2437]} } to show temperature of all Kingo T's in Los Angeles, and `locationDefault` for all other club members
         *   Defaults to `{}` (no overrides)
         */
        locationPerMember?: Record<string, WeatherSearchLocation | null>;
        /**
         * Set a callback function to lookup temperature that is called instead of a WeatherApi request
         *
         * Cannot be used in bootstrap mode
         */
        getTemperature?: (
          params: WeatherSearchLocation,
          time: number
        ) => number;
      }
    | undefined;
}

export type SettingsWithDefaults = Required<Settings>;
