import { getClubActivityString } from './message-formatter';
import { clubActivitiesFixture } from './data-fixture';
import { Settings, getSettingsWithDefaults } from './settings';

describe('getClubActivityString', () => {
  function getSettings(partialSettings: Partial<Settings>) {
    const testDefaults: Settings = {
      homeserverUrl: '',
      matrixAccessToken: '',
      stravaClientId: '',
      stravaClientSecret: '',
      stravaClub: '',
      stravaAccessToken: '',
      stravaRefreshToken: '',
      pollFrequency: 100,
      emoji: false,
      onBotJoinRoomMessage: undefined,
      includeElevation: false,
      includeSpeed: false,
      includeStartingTime: undefined,
    };
    return { ...getSettingsWithDefaults(testDefaults), ...partialSettings };
  }

  test('should work in kilometer mode with no extra formating', () => {
    expect(
      getClubActivityString(
        clubActivitiesFixture[0],
        getSettings({
          speedUnitPerActivity: {},
          distanceUnit: 'kilometer',
        })
      )
    ).toEqual('Carl M. - Morning Ride - 11.73 kilometers in 1 hour 21 minutes');
    expect(
      getClubActivityString(
        clubActivitiesFixture[1],
        getSettings({
          speedUnitPerActivity: {},
          distanceUnit: 'kilometer',
        })
      )
    ).toEqual('Alfred C. - Morning Run - 10.09 kilometers in 1 hour');
    expect(
      getClubActivityString(
        clubActivitiesFixture[2],
        getSettings({
          speedUnitPerActivity: {},
          distanceUnit: 'kilometer',
        })
      )
    ).toEqual(
      'Olaf P. - Dog walk and leafing - 2.03 kilometers in 33 minutes 57 seconds'
    );
  });

  test('should work in miles mode', () => {
    expect(
      getClubActivityString(
        clubActivitiesFixture[0],
        getSettings({
          speedUnitPerActivity: {},
          distanceUnit: 'mile',
        })
      )
    ).toEqual('Carl M. - Morning Ride - 7.29 miles in 1 hour 21 minutes');
    expect(
      getClubActivityString(
        clubActivitiesFixture[1],
        getSettings({
          speedUnitPerActivity: {},
          distanceUnit: 'mile',
        })
      )
    ).toEqual('Alfred C. - Morning Run - 6.27 miles in 1 hour');
  });

  test('should work in mph speed mode with elevation and average speed', () => {
    const settings: Partial<Settings> = {
      distanceUnit: 'mile',
      speedUnitDefault: 'mph',
      speedUnitPerActivity: {},
      includeSpeed: true,
      includeElevation: true,
    };
    expect(
      getClubActivityString(clubActivitiesFixture[0], getSettings(settings))
    ).toEqual(
      'Carl M. - Morning Ride - 7.29 miles | 1657.8ft elev gain in 1 hour 21 minutes (5.4mph)'
    );
    expect(
      getClubActivityString(clubActivitiesFixture[1], getSettings(settings))
    ).toEqual(
      'Alfred C. - Morning Run - 6.27 miles | 254.6ft elev gain in 1 hour (6.26mph)'
    );
  });

  test('should work in min/mi speed mode with elevation', () => {
    const settings: Partial<Settings> = {
      distanceUnit: 'mile',
      speedUnitDefault: 'min/mi',
      speedUnitPerActivity: {},
      includeSpeed: true,
      includeElevation: true,
    };
    expect(
      getClubActivityString(clubActivitiesFixture[1], getSettings(settings))
    ).toEqual(
      'Alfred C. - Morning Run - 6.27 miles | 254.6ft elev gain in 1 hour (9.58/mi)'
    );
  });

  test('should work with speedUnitPerActivity override with no elevation', () => {
    const settings: Partial<Settings> = {
      distanceUnit: 'mile',
      speedUnitDefault: 'mph',
      speedUnitPerActivity: { Run: 'min/mi' },
      includeSpeed: true,
    };
    expect(
      getClubActivityString(clubActivitiesFixture[1], getSettings(settings))
    ).toEqual('Alfred C. - Morning Run - 6.27 miles in 1 hour (9.58/mi)');
  });

  test('should work with starting time shown', () => {
    const settings: Partial<Settings> = {
      includeStartingTime: {
        timezoneDefault: 'America/Chicago',
      },
    };
    const clubActivityString = getClubActivityString(
      clubActivitiesFixture[1],
      getSettings(settings)
    );
    // Manually verify timezone code works...
    console.log(
      'Did this activity start a hour ago in chicago?\n  ' + clubActivityString
    );
    expect(clubActivityString).toContain(
      'Alfred C. - Morning Run - 6.27 miles in 1 hour starting at '
    );
  });

  test('should work with starting time shown, speed, and elevation', () => {
    const settings: Partial<Settings> = {
      includeStartingTime: {
        timezoneDefault: 'America/Chicago',
      },
      includeSpeed: true,
      includeElevation: true,
    };
    const clubActivityString = getClubActivityString(
      clubActivitiesFixture[1],
      getSettings(settings)
    );
    // Manually verify timezone code works...
    console.log(
      'Did this activity start a hour ago in chicago?\n  ' + clubActivityString
    );
    expect(clubActivityString).toContain(
      'Alfred C. - Morning Run - 6.27 miles | 254.6ft elev gain in 1 hour (6.26mph) starting at '
    );
  });
});
