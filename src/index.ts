/* eslint-disable no-console */
import { readFileSync } from 'fs';
import { join } from 'path';

import { startPoll } from './bot';
import { Settings } from './settings';

let settings: Settings;

// bootstrap
try {
  settings = JSON.parse(
    readFileSync(join(__dirname, '..', 'bot-settings.json'), { encoding: 'utf8' })
  );
} catch (e) {
  console.error('Failed loading Bot Settings', e);
  throw new Error('Failed loading Bot Settings');
}

process.argv.forEach((arg) => {
  if (arg.toLowerCase().includes('--dryrun')) {
    settings.dryRun = true;
  }
});

startPoll(settings);
