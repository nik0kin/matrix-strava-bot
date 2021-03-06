import { Settings, SettingsWithDefaults } from './settings';

export function getValidatedSettingsWithDefaults(
  userSettings: Settings
): SettingsWithDefaults {
  // Set defaults
  const settings: SettingsWithDefaults = {
    storageFile: 'bot-storage.json',
    dryRun: false,
    autoJoin: false,
    distanceUnit: 'kilometer',
    speedUnitDefault: 'kmph',
    speedUnitPerActivity: {},
    includeSpeed: true,
    includeElevation: true,
    ...userSettings,
  };

  // Validate and set nested settings defaults
  if (
    settings.includeStartingTime &&
    !settings.includeStartingTime.timezoneDefault
  ) {
    console.error(
      '`includeStartingTime.timezoneDefault` not set, turning `includeStartingTime` off'
    );
    settings.includeStartingTime = undefined;
  }

  if (settings.includeTemp && !settings.includeTemp.unit) {
    settings.includeTemp.unit = 'metric';
  }

  if (
    (settings.includeTemp && !settings.includeTemp.weatherApiDotComApiKey) ||
    settings.includeTemp?.locationDefault
  ) {
    console.error(
      '`includeTemp.weatherApiDotComApiKey` or `includeTemp.locationDefault` not set, turning `includeTemp` off'
    );
    settings.includeTemp = undefined;
  }

  return settings;
}

export function getSpeedUnit(type: string, settings: SettingsWithDefaults) {
  return settings.speedUnitPerActivity[type] || settings.speedUnitDefault;
}

export function getTimezone(
  clubMember: string,
  settings: SettingsWithDefaults
) {
  const startingTimeSettings = settings.includeStartingTime!;
  return (
    (startingTimeSettings.timezonePerMember || {})[clubMember] ||
    startingTimeSettings.timezoneDefault
  );
}

export function shouldHideStartingTime(
  clubMember: string,
  settings: SettingsWithDefaults
) {
  return (
    (settings?.includeStartingTime!.timezonePerMember || {})[clubMember] ===
    null
  );
}

export function getLocation(
  clubMember: string,
  settings: SettingsWithDefaults
) {
  const tempSettings = settings.includeTemp!;
  return (
    (tempSettings.locationPerMember || {})[clubMember] ||
    tempSettings.locationDefault
  );
}

export function shouldHideTemperature(
  clubMember: string,
  settings: SettingsWithDefaults
) {
  return (settings.includeTemp!.locationPerMember || {})[clubMember] === null;
}
