import { format } from 'date-fns';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

import { SettingsWithDefaults, WeatherSearchLocation } from './settings';

export async function getTemperature(
  location: WeatherSearchLocation,
  time: number, // in ms
  settings: SettingsWithDefaults
): Promise<number> {
  if (!settings.includeTemp) {
    throw new Error('getTemperature() with falsy settings.includeTemp');
  }

  const tempSettings = settings.includeTemp;

  if (tempSettings.getTemperature) {
    return tempSettings.getTemperature(location, time);
  }

  const requestParams = new URLSearchParams({
    key: tempSettings.weatherApiDotComApiKey,
    type: 'hour',
    dt: format(new Date(time), 'y-MM-dd'),
  });

  if (location.coordinate) {
    requestParams.set(
      'q',
      `${location.coordinate[0]},${location.coordinate[1]}`
    );
  }

  if (location.q) {
    requestParams.set('q', location.q);
  }

  const response = await fetch(
    `https://api.weatherapi.com/v1/history.json?${requestParams.toString()}`
  );
  const data: WeatherApiHistoryResponse = await response.json();

  // look for closest hour from forecast
  // based on https://stackoverflow.com/a/19277804/346485
  const secondsSinceEpoch = time / 1000;
  const hourForecast = data.forecast.forecastday[0].hour.reduce(
    (prev, curr) => {
      return Math.abs(curr.time_epoch - secondsSinceEpoch) <
        Math.abs(prev.time_epoch - secondsSinceEpoch)
        ? curr
        : prev;
    }
  );

  return tempSettings.unit === 'metric'
    ? hourForecast.temp_c
    : hourForecast.temp_f;
}

// Keep an eye on https://pirateweather.net/ , but no time machine yet

interface WeatherApiHistoryResponse {
  forecast: {
    forecastday: Array<{
      hour: Array<{
        time_epoch: number;
        temp_c: number;
        temp_f: number;
      }>;
    }>;
  };
}
