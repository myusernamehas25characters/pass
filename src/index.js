import os from 'os';

import { Command } from 'tauris';
import getPackageVersion from '@jsbits/get-package-version';

import command_generate from './commands/generate';
import command_init from './commands/init';
import command_view from './commands/view';
import command_remove from './commands/remove';
import command_store from './commands/store';

const PASSFILE_PATH = `${os.homedir()}/.passfile`;

const argv = new Command('pass')
  .describe('CLI password manager')
  .option('v', {
    alias: ['version'],
    type: 'boolean',
    description: 'Display version information',
  })
  .command(command_init({ PASSFILE_PATH: PASSFILE_PATH }))
  .command(command_generate({ PASSFILE_PATH: PASSFILE_PATH }))
  .command(command_view({ PASSFILE_PATH: PASSFILE_PATH }))
  .command(command_remove({ PASSFILE_PATH: PASSFILE_PATH }))
  .command(command_store({ PASSFILE_PATH: PASSFILE_PATH }))
  .demandArgument()
  .parse(process.argv.slice(2));

if (argv && argv.v) {
  console.log(getPackageVersion(__dirname));
}
