# matrix-strava-bot

Reports Strava club activities.

```
Kingo T. 🚶 Afternoon Walk - 3.13 kilometers in 30:19 minutes
```

Unfortunately due to public Strava API restrictions, we cannot query more information on a given club activity, and thus the bot can't link to it

## Develop

```
yarn install
yarn dev
```

## Run

```
yarn global add pm2
pm2 start pm2.config.js
```

## Config

```
cp bot-config.sample.json bot-config.json
```

See [settings.ts](./src/settings.ts) for config descriptions

Setup a Strava api client key and generate an accessToken at https://www.strava.com/settings/api

## Reference

Uses Strava v3 api: http://developers.strava.com/docs/reference/
