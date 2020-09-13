/* eslint-disable no-console */
import { readFileSync } from 'fs';
import { join } from 'path';

import { startPoll } from './bot';

let settings: any;

// bootstrap
try {
  settings = JSON.parse(
    readFileSync(join(__dirname, '..', 'bot-settings.json'), { encoding: 'utf8' })
  );
} catch (e) {
  console.error('Failed loading Bot Settings', e);
}

startPoll(settings);
