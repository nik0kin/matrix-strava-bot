import { getClubActivityString } from './message-formatter';
import { clubActivitiesFixture } from './data-fixture';

describe('getClubActivityString', () => {
  test('should work with no extra formatting', () => {
    expect(getClubActivityString(clubActivitiesFixture[0]))
      .toEqual('Carl M. - Morning Ride - 11.73 kilometers in 81:02 minutes');
    expect(getClubActivityString(clubActivitiesFixture[1]))
      .toEqual('Alfred C. - Morning Run - 10.09 kilometers in 60:03 minutes');
  });
});
