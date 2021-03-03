import { formatDuration } from 'date-fns';
import { ClubActivity } from 'strava-v3';

import { SettingsWithDefaults, SpeedUnit } from './settings';
import { toMiles, toFt } from './distance';

const activityTypeEmojiMapping: Record<string, string> = {
  AlpineSki: '⛷️',
  BackcountrySki: '⛷️',
  Canoeing: '🛶',
  Crossfit: '',
  EBikeRide: '',
  Elliptical: '',
  Golf: '🏌️',
  Handcycle: '',
  Hike: '🥾',
  IceSkate: '⛸️',
  InlineSkate: '🛼',
  Kayaking: '',
  Kitesurf: '',
  NordicSki: '⛷️',
  Ride: '🚲️',
  RockClimbing: '🧗',
  RollerSki: '',
  Rowing: '🚣',
  Run: '🏃',
  Sail: '⛵',
  Skateboard: '🛹',
  Snowboard: '🏂',
  Snowshoe: '',
  Soccer: '⚽',
  StairStepper: '',
  StandUpPaddling: '',
  Surfing: '🏄',
  Swim: '🏊',
  Velomobile: '',
  VirtualRide: '',
  VirtualRun: '',
  Walk: '🚶',
  WeightTraining: '',
  Wheelchair: '🧑‍🦽',
  Windsurf: '',
  Workout: '',
  Yoga: '🧘',
};

// "Bob R. - ActivityTitle - 6.27 miles in 1 hour (6.26mph), 254.6ft elev gain"
export function getClubActivityString(
  item: ClubActivity,
  settings: SettingsWithDefaults
) {
  const typeEmoji = settings.emoji
    ? activityTypeEmojiMapping[item.type] || ''
    : '';
  const kilometers = item.distance / 1000;
  const distance =
    settings.distanceUnit === 'kilometer'
      ? `${formatNumber(kilometers)} kilometers`
      : `${formatNumber(toMiles(kilometers))} miles`;
  const speedUnit = getSpeedUnit(item.type, settings);
  const average = settings.includeSpeed
    ? ` (${getAverageSpeedString(item, speedUnit)})`
    : '';
  const elevGain =
    settings.distanceUnit === 'kilometer'
      ? `${formatNumber(item.total_elevation_gain, 1)}m`
      : `${formatNumber(toFt(item.total_elevation_gain), 1)}ft`;
  const elevGainStr = settings.includeElevation
    ? `, ${elevGain} elev gain`
    : '';
  return `${item.athlete.firstname} ${item.athlete.lastname} ${
    typeEmoji || '-'
  } ${item.name} - ${distance} in ${getDurationString(
    item.moving_time
  )}${average}${elevGainStr}`;
}

function getDurationString(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 60 / 60);

  if (hours > 0) {
    const minutes = Math.floor(totalSeconds / 60) % 60;
    return formatDuration({
      hours,
      minutes,
    });
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return formatDuration({
    minutes,
    seconds,
  });
}

function getSpeedUnit(type: string, settings: SettingsWithDefaults) {
  return settings.speedUnitPerActivity[type] || settings.speedUnitDefault;
}

function getAverageSpeedString(item: ClubActivity, speedUnit: SpeedUnit) {
  const kilometers = item.distance / 1000;
  const distance =
    speedUnit === 'mph' || speedUnit === 'min/mi'
      ? toMiles(kilometers)
      : kilometers;
  const timeInMinutes = item.moving_time / 60;

  if (speedUnit === 'mph' || speedUnit === 'kmph') {
    const timeInHours = timeInMinutes / 60;
    return `${formatNumber(distance / timeInHours)}${speedUnit}`;
  }

  return `${formatNumber(timeInMinutes / distance)}${speedUnit.replace(
    'min',
    ''
  )}`;
}

function formatNumber(num: number, decimalPlaces = 2) {
  const a = Math.pow(10, decimalPlaces);
  num = Math.round(num * a) / a;
  return `${num}`;
}
