import { Settings } from './settings';
import { ClubActivity } from './strava';
import { toMiles } from './distance';

const activityTypeEmojiMapping = {
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
} as const;

// "Bob Roberts: ActivityTitle - 4.44 kilometers in 3:13 minutes"
export function getClubActivityString(item: ClubActivity, settings: Settings) {
  const typeEmoji = settings.emoji ? activityTypeEmojiMapping[item.type as keyof typeof activityTypeEmojiMapping] || '' : '';
  const kilometers = item.distance / 1000;
  const distance = !settings.useMiles ?
    `${formatNumber(kilometers)} kilometers` :
    `${formatNumber(toMiles(kilometers))} miles`;
  return `${item.athlete.firstname} ${item.athlete.lastname} ${typeEmoji || '-'} ${item.name} - ${
    distance} in ${secondsToMinutes(item.moving_time)} minutes`;
}

function secondsToMinutes(seconds: number) {
  const sec = seconds % 60;
  return `${Math.floor(seconds / 60)}:${(sec < 10 ? '0' : '') + sec}`;
}

function formatNumber(num: number, decimalPlaces = 2) {
  const a = Math.pow(10, decimalPlaces);
  num = Math.round(num * a) / a;
  return `${num}`;
}
