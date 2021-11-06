import fs from 'fs';
import path from 'path';
import os from 'os';

import chalk from 'chalk';
import { Command } from 'tauris';
import { prompt } from 'enquirer';

import { makeKey } from '../cryptography';
import { findPassword, requirePassFile, checkMaster } from '../utils';
import { selectPassword } from '../interface';

export default function command_init(options) {
  options = {
    PASSFILE_PATH: `${os.homedir()}/.passfile`,
    ...options,
  };

  return new Command('view').describe('View a password').handler((argv) => {
    (async () => {
      if (!argv.parameters?.[0]) {
        console.log(
          chalk`{red.bold Error:} You must provide a service (and optionally a keyword) to view a password`
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

      const pass = findPassword(
        passwords,
        p_service,
        p_keyword,
        makeKey(password)
      );

      if (!pass) {
        console.log(
          chalk`{red.bold Error:} Could not find password for {cyan ${p_service} ${p_keyword}}`
        );
        process.exit(1);
      }

      console.log(
        chalk`Password: {cyan ${pass.split(' ').slice(2).join(' ')}}`
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
