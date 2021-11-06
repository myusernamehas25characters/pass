import fs from 'fs';
import path from 'path';
import os from 'os';

import chalk from 'chalk';
import { Command } from 'tauris';
import { prompt } from 'enquirer';

import {
  findPassword,
  requirePassFile,
  checkMaster,
  addPassword,
} from '../utils';
import { makeKey } from '../cryptography';

export default function command_store(options) {
  options = {
    PASSFILE_PATH: `${os.homedir()}/.passfile`,
    ...options,
  };

  return new Command('store')
    .describe('Store an existing password in your passfile')
    .usage('pass store <service> [<keyword>] <password>')
    .handler((argv) => {
      (async () => {
        if (argv.parameters?.length < 2) {
          console.log(
            chalk`{red.bold Error:} You must provide a service, optional keyword and password to run this command`
          );
          process.exit(1);
        }
        const service = argv.parameters[0];
        const keyword = argv.parameters.length === 3 ? argv.parameters[1] : '*';

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

        addPassword(
          passwords,
          service,
          keyword,
          argv.parameters[argv.parameters.length - 1],
          makeKey(password),
          options.PASSFILE_PATH
        );

        console.log(chalk`{green ✔️} Added your password`);
      })()
        .then((_v) => {})
        .catch((err) => {
          console.log(
            chalk`{red.bold Error:} ${err.message} {gray (unhandled exception)}`
          );
        });
    });
}
