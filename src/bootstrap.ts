/* eslint-disable no-console */
import { readFileSync } from 'fs';
import { join } from 'path';

import { startBot } from './bot';
import { Settings } from './settings';

let settings: Settings;

// bootstrap
try {
  settings = JSON.parse(
    readFileSync(join(__dirname, '..', 'bot-config.json'), { encoding: 'utf8' })
  );
} catch (e) {
  const errorMsg = 'Failed loading bot-config.json';
  console.error(errorMsg, e);
  throw new Error(errorMsg);
}

process.argv.forEach((arg) => {
  if (arg.toLowerCase().includes('--dryrun')) {
    settings.dryRun = true;
  }
});

startBot(settings);
