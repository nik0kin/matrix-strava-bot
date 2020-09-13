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
