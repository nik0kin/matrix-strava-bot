import { format, formatDuration } from 'date-fns';
import { ClubActivity } from 'strava-v3';

import { toMiles, toFt } from './distance';
import { SettingsWithDefaults, SpeedUnit } from './settings';
import { convertTZ } from './timezone';
import {
  getSpeedUnit,
  getTimezone,
  shouldHideStartingTime,
} from './settings-helpers';

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

// "Bob R. 🏃 Morning Run - 3.55 miles | 201.77ft elev gain in 31 minutes 39 seconds (6.73mph) starting at 7:56am (40 °F)"
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
    ? ` | ${elevGain} elev gain`
    : '';
  const startingTimeStr =
    settings.includeStartingTime &&
    !shouldHideStartingTime(getTrimmedName(item.athlete), settings)
      ? ` starting at ${getStartingTime(item, settings)}`
      : '';

  return `${getTrimmedName(item.athlete)} ${typeEmoji || '-'} ${
    item.name
  } - ${distance}${elevGainStr} in ${getDurationString(
    item.moving_time
  )}${average}${startingTimeStr}`;
}

function getTrimmedName(athlete: ClubActivity['athlete']) {
  return `${athlete.firstname} ${athlete.lastname}`.trim(); // Might help if someone doesnt have a last name set?
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

// gets human readable time (7:00AM, 12:00PM, etc)
function getStartingTime(item: ClubActivity, settings: SettingsWithDefaults) {
  // Guess starting time (processingCurrentTime - item.elapsed_time = activityStartingTime)
  const activityStartingTime = Date.now() - item.elapsed_time * 1000;

  // Adjust time to activity timezone
  const timeZone = getTimezone(getTrimmedName(item.athlete), settings);
  const activityStartingTimeWithTimezoneAdjustment = convertTZ(
    new Date(activityStartingTime),
    timeZone
  );

  return format(activityStartingTimeWithTimezoneAdjustment, 'hh:mm a').replace(
    ' ',
    ''
  );
}
