import { SettingsWithDefaults } from './settings';

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
