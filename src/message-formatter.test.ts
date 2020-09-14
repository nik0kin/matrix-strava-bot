import { getClubActivityString } from './message-formatter';
import { clubActivitiesFixture } from './data-fixture';

describe('getClubActivityString', () => {
  test('should work with no extra formatting', () => {
    expect(getClubActivityString(clubActivitiesFixture[0], {} as any)).toEqual(
      'Carl M. - Morning Ride - 11.73 kilometers in 1 hour 21 minutes'
    );
    expect(getClubActivityString(clubActivitiesFixture[1], {} as any)).toEqual(
      'Alfred C. - Morning Run - 10.09 kilometers in 1 hour'
    );
    expect(getClubActivityString(clubActivitiesFixture[2], {} as any)).toEqual(
      'Olaf P. - Dog walk and leafing - 2.03 kilometers in 33 minutes 57 seconds'
    );
  });
  test('should work in miles mode', () => {
    expect(
      getClubActivityString(clubActivitiesFixture[0], { useMiles: true } as any)
    ).toEqual('Carl M. - Morning Ride - 7.29 miles in 1 hour 21 minutes');
    expect(
      getClubActivityString(clubActivitiesFixture[1], { useMiles: true } as any)
    ).toEqual('Alfred C. - Morning Run - 6.27 miles in 1 hour');
  });
});
