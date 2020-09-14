import { formatDuration } from 'date-fns';

import { Settings } from './settings';
import { ClubActivity } from './strava';
import { toMiles } from './distance';

const activityTypeEmojiMapping: Record<string, string> = {
  AlpineSki: '',
  BackcountrySki: '',
  Canoeing: '',
  Crossfit: '',
  EBikeRide: '',
  Elliptical: '',
  Golf: '',
  Handcycle: '',
  Hike: '',
  IceSkate: '',
  InlineSkate: '',
  Kayaking: '',
  Kitesurf: '',
  NordicSki: '',
  Ride: '🚲️',
  RockClimbing: '',
  RollerSki: '',
  Rowing: '',
  Run: '🏃',
  Sail: '',
  Skateboard: '',
  Snowboard: '',
  Snowshoe: '',
  Soccer: '',
  StairStepper: '',
  StandUpPaddling: '',
  Surfing: '',
  Swim: '',
  Velomobile: '',
  VirtualRide: '',
  VirtualRun: '',
  Walk: '🚶',
  WeightTraining: '',
  Wheelchair: '',
  Windsurf: '',
  Workout: '',
  Yoga: '',
};

// "Bob Roberts: ActivityTitle - 4.44 kilometers in 3 minutes 13 seconds"
export function getClubActivityString(item: ClubActivity, settings: Settings) {
  const typeEmoji = settings.emoji ? activityTypeEmojiMapping[item.type] || '' : '';
  const kilometers = item.distance / 1000;
  const distance = !settings.useMiles ?
    `${formatNumber(kilometers)} kilometers` :
    `${formatNumber(toMiles(kilometers))} miles`;
  return `${item.athlete.firstname} ${item.athlete.lastname} ${typeEmoji || '-'} ${item.name} - ${
    distance} in ${getDurationString(item.moving_time)}`;
}

function getDurationString(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 60 / 60);

  if (hours > 0) {
    const minutes = Math.floor(totalSeconds / 60) % 60;
    return formatDuration({
      hours,
      minutes
    });
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return formatDuration({
    minutes,
    seconds
  });
}

function formatNumber(num: number, decimalPlaces = 2) {
  const a = Math.pow(10, decimalPlaces);
  num = Math.round(num * a) / a;
  return `${num}`;
}
