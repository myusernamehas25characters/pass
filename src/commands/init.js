import fs from 'fs';
import path from 'path';
import os from 'os';

import chalk from 'chalk';
import { Command } from 'tauris';
import { prompt } from 'enquirer';

import { encrypt, makeKey } from '../cryptography';

export default function command_init(options) {
  options = {
    PASSFILE_PATH: `${os.homedir()}/.passfile`,
    ...options,
  };

  return new Command('init')
    .describe('Initiliase the passfile')
    .handler((argv) => {
      (async () => {
        if (fs.existsSync(path.resolve(options.PASSFILE_PATH))) {
          console.log(
            chalk`{red.bold Error:} There already is an initialised passfile`
          );
          process.exit(1);
        }

        const { password } = await prompt({
          type: 'password',
          name: 'password',
          message: 'Choose a master password:',
        });

        fs.writeFileSync(
          path.resolve(options.PASSFILE_PATH),
          encrypt('valid key', makeKey(password))
        );
      })()
        .then((_v) => {})
        .catch((err) => {
          console.log(
            chalk`{red.bold Error:} ${err.message} {gray (unhandled exception)}`
          );
        });
    });
}
