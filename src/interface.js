import chalk from 'chalk';
import { prompt } from 'enquirer';
import { findPassword, findPasswordsForService } from './utils';

export async function selectPassword(passwords, service, keyword, key) {
  if (keyword) {
    const pass = findPassword(passwords.slice(1), service, keyword, key);
    if (!pass) {
      console.log(chalk`{red.bold Error:} Password not found`);
      process.exit(1);
    }
    return { service, keyword };
  } else {
    const passwordsForService = findPasswordsForService(
      passwords.slice(1),
      service,
      key
    );
    if (!passwordsForService) {
      console.log(chalk`{red.bold Error:} Service not found`);
      process.exit(1);
    }

    if (passwordsForService.length === 1 && passwordsForService[0] === '*') {
      return { service, keyword: '*' };
    }

    const { choice } = await prompt({
      type: 'select',
      name: 'choice',
      message: 'There are multiple passwords for this service:',
      choices: passwordsForService,
    });

    return { service, keyword: choice };
  }
}
