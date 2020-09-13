// import { Settings } from './settings';
import { ClubActivity } from './strava';

// "Bob Roberts: ActivityTitle - 4.44 kilometers in 3:13 minutes"
export function getClubActivityString(item: ClubActivity/*, settings?: Settings, htmlFormatted?: boolean*/) {
  return `${item.athlete.firstname} ${item.athlete.lastname} - ${item.name} - ${
    formatNumber(item.distance / 1000)} kilometers in ${secondsToMinutes(item.moving_time)} minutes`;
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
