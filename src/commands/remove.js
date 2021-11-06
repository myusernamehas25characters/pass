import fs from 'fs';
import path from 'path';
import os from 'os';

import chalk from 'chalk';
import { Command } from 'tauris';
import { prompt } from 'enquirer';

import { makeKey } from '../cryptography';
import { requirePassFile, checkMaster, removePassword } from '../utils';
import { selectPassword } from '../interface';

export default function command_remove(options) {
  options = {
    PASSFILE_PATH: `${os.homedir()}/.passfile`,
    ...options,
  };

  return new Command('remove').describe('Delete a password').handler((argv) => {
    (async () => {
      if (!argv.parameters?.[0]) {
        console.log(
          chalk`{red.bold Error:} You must provide a service (and optionally a keyword) to remove a password`
        );
        process.exit(1);
      }
      const service = argv.parameters[0];
      const keyword = argv.parameters[1] || '';

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

      const { service: p_service, keyword: p_keyword } = await selectPassword(
        passwords,
        service,
        keyword,
        makeKey(password)
      );

      const { confirm } = await prompt({
        name: 'confirm',
        type: 'confirm',
        message: chalk`Are you sure you want to delete your password for ${p_service} ${p_keyword}?`,
      });

      if (confirm) {
        removePassword(
          passwords,
          p_service,
          p_keyword,
          makeKey(password),
          options.PASSFILE_PATH
        );
        console.log(chalk`{green ✔} Password deleted`);
      } else {
        console.log(chalk`{red.bold ×} Operation aborted`);
      }
    })()
      .then((_v) => {})
      .catch((err) => {
        console.log(
          chalk`{red.bold Error:} ${err.message} {gray (unhandled exception)}`
        );
      });
  });
}
