import chalk from 'chalk';
import { randomFillSync } from 'crypto';
import fs from 'fs';
import path from 'path';
import { makeKey, decrypt, encrypt } from './cryptography';

export function requirePassFile(file) {
  if (!fs.existsSync(path.resolve(file))) {
    console.log(
      chalk`{red.bold Error:} No passfile exists. Please run {cyan pass init} first.`
    );
    process.exit(1);
  }
}

export function checkMaster(password, file) {
  requirePassFile(file);

  const key = makeKey(password);
  const testLine = fs
    .readFileSync(path.resolve(file))
    .toString()
    .split('\n')[0];

  try {
    const output = decrypt(testLine, key);
    if (output !== '"valid key"') throw new Error();
  } catch (e) {
    console.log(chalk`{red.bold Error:} Invalid password. Please try again`);
    process.exit(1);
  }
}

export function generatePassword() {
  const data = randomFillSync(Buffer.alloc(8));
  return data.toString('hex');
}

export function findPassword(passwords, service, keyword, key) {
  const dec_passwords = passwords.map((p) => JSON.parse(decrypt(p, key)));
  return (
    dec_passwords.find((p) => p.startsWith(`${service} ${keyword}`)) || null
  );
}

export function findPasswordsForService(passwords, service, key) {
  const dec_passwords = passwords.map((p) => JSON.parse(decrypt(p, key)));
  const r = dec_passwords
    .filter((p) => p.startsWith(service))
    .map((p) => p.split(' ')[1]);
  return r.length === 0 ? null : r;
}

function _write(passfile, r) {
  fs.writeFileSync(path.resolve(passfile), r.join('\n'));
}

export function removePassword(passwords, service, keyword, key, passfile) {
  const dec_passwords = passwords.map((p) => JSON.parse(decrypt(p, key)));
  const r = dec_passwords.reduce(
    (acc, v) => (v.startsWith(`${service} ${keyword}`) ? acc : acc.concat(v)),
    []
  );
  const e = r.map((p) => encrypt(p, key));
  _write(passfile, e);
}

export function addPassword(
  passwords,
  service,
  keyword,
  password,
  key,
  passfile
) {
  _write(
    passfile,
    passwords.concat(encrypt(`${service} ${keyword} ${password}`, key))
  );
}
