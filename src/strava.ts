import strava from 'strava-v3';

export interface ClubActivity {
  resource_state: number,
  athlete: { resource_state: number, firstname: string, lastname: string },
  name: string,
  distance: number,
  moving_time: number,
  elapsed_time: number,
  total_elevation_gain: number,
  type: string,
  workout_type: any
}

export function listStravaClubActivities(args: any): Promise<ClubActivity[]> {
  return new Promise((resolve, reject) => {
    // typing lies: doesnt support promises
    strava.clubs.listActivities(args, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}
