import { getValidatedSettingsWithDefaults } from './settings-helpers';

describe('setting helpers', () => {
  test('getValidatedSettingsWithDefaults() should disable includeTemp if there is not enough configuration', () => {
    expect(
      getValidatedSettingsWithDefaults({
        includeTemp: {},
      } as any).includeTemp
    ).toBeFalsy();
    expect(
      getValidatedSettingsWithDefaults({
        includeTemp: {
          weatherApiDotComApiKey: 'blah-secret',
        },
      } as any).includeTemp
    ).toBeFalsy();
    expect(
      getValidatedSettingsWithDefaults({
        includeTemp: {
          getTemperature: () => 30,
        },
      } as any).includeTemp
    ).toBeFalsy();
    expect(
      getValidatedSettingsWithDefaults({
        includeTemp: {
          locationDefault: { coordinates: [30, 30] },
        },
      } as any).includeTemp
    ).toBeFalsy();

    expect(
      getValidatedSettingsWithDefaults({
        includeTemp: {
          weatherApiDotComApiKey: 'blah-secret',
          locationDefault: { coordinate: [30, 30] },
          unit: 'metric',
        },
      } as any).includeTemp
    ).toBeTruthy();
  });
});
