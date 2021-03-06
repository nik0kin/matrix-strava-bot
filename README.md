# matrix-strava-bot

Reports Strava club activities.

```
Kingo T. 🚶 Afternoon Walk - 3.13 kilometers in 30 minutes 19 seconds

// All Options
Kingo T. 🚶 Afternoon Walk - 3.13 kilometers | 10m elev gain in 30 minutes 19 seconds (6.26kmph) starting at 10:12PM
```

Unfortunately due to public Strava API restrictions, we cannot query more information on a given club activity, and thus the bot can't link to it.

## Develop

```
yarn install
yarn dev
```

## Run

### Bootstrap mode

```
# clone repo
yarn install

cp bot-config.sample-world.json bot-config.json
# configure bot-config.json

yarn global add pm2
pm2 start pm2.config.js
```

### As a Node.js package

```
yarn add matrix-strava-bot
```

```
import { startBot } from 'matrix-strava-bot';

const config = {
  // see bot-config.sample.json
};

startBot(config);
```

## Config

See [settings.ts](./src/settings.ts) for config descriptions

Setup a Strava api client key and generate an accessToken at https://www.strava.com/settings/api

## Reference

Uses Strava v3 api: http://developers.strava.com/docs/reference/
