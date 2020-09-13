export const clubActivitiesFixture = [
  {
    resource_state: 2,
    athlete: { resource_state: 2, firstname: 'Carl', lastname: 'M.' },
    name: 'Morning Ride',
    distance: 11726.5,
    moving_time: 4862,
    elapsed_time: 7919,
    total_elevation_gain: 505.3,
    type: 'Ride',
    workout_type: null
  },
  {
    resource_state: 2,
    athlete: { resource_state: 2, firstname: 'Alfred', lastname: 'C.' },
    name: 'Morning Run',
    distance: 10086.3,
    moving_time: 3603,
    elapsed_time: 4078,
    total_elevation_gain: 77.6,
    type: 'Run',
    workout_type: 0
  },
  {
    resource_state: 2,
    athlete: { resource_state: 2, firstname: 'Olaf', lastname: 'P.' },
    name: 'Dog walk and leafing',
    distance: 2026,
    moving_time: 2037,
    elapsed_time: 3027,
    total_elevation_gain: 4.6,
    type: 'Walk'
  }
] as const;