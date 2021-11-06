import fs from 'fs';
import path from 'path';
import os from 'os';

import chalk from 'chalk';
import { Command } from 'tauris';
import { prompt } from 'enquirer';

import {
  requirePassFile,
  checkMaster,
  generatePassword,
  findPassword,
  addPassword,
} from '../utils';
import { makeKey } from '../cryptography';

export default function command_generate(options) {
  options = {
    PASSFILE_PATH: `${os.homedir()}/.passfile`,
    ...options,
  };

  return new Command('generate')
    .describe(
      'Generate a new password for a service & keyword and save it in your passfile'
    )
    .handler((argv) => {
      (async () => {
        if (!argv.parameters?.[0]) {
          console.log(
            chalk`{red.bold Error:} You must provide a service (and optionally a keyword) to generate a password`
          );
          process.exit(1);
        }
        const service = argv.parameters[0];
        const keyword = argv.parameters[1] || '*';

        if (service.includes(' ') || keyword.includes(' ')) {
          console.log(
            chalk`{red.bold Error:} Keywords and services may not contain spaces`
          );
        }

        requirePassFile(options.PASSFILE_PATH);

        const { password } = await prompt({
          type: 'password',
          name: 'password',
          message: 'Master password:',
        });

        checkMaster(password, options.PASSFILE_PATH);

        const passFile = fs
          .readFileSync(path.resolve(options.PASSFILE_PATH))
          .toString();
        const passwords = passFile.split('\n');

        if (
          findPassword(passwords.slice(1), service, keyword, makeKey(password))
        ) {
          console.log(
            chalk`{red.bold Error:} There's already a password with this service and keyword. Try a different keyword.`
          );
          process.exit(1);
        }

        const generated = generatePassword();

        addPassword(
          passwords,
          service,
          keyword,
          generated,
          makeKey(password),
          options.PASSFILE_PATH
        );

        console.log(chalk`Generated password: {cyan ${generated}}`);
      })()
        .then((_v) => {})
        .catch((err) => {
          console.log(
            chalk`{red.bold Error:} ${err.message} {gray (unhandled exception)}`
          );
        });
    });
}
