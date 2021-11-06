import {
  scryptSync,
  createCipheriv,
  randomFillSync,
  createDecipheriv,
} from 'crypto';

export function makeKey(password) {
  const key = scryptSync(password, 'salt', 24);

  return key;
}

export function encrypt(data, key) {
  const iv = randomFillSync(new Uint8Array(16));
  const cipher = createCipheriv('aes-192-cbc', key, iv);

  const _c = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  const encrypted = _c + cipher.final('hex');

  const ivBuffer = Buffer.from(iv.buffer);

  return encrypted + ' ' + ivBuffer.toString('hex');
}

export function decrypt(data, key) {
  const content = data.split(' ')[0];
  const ivString = data.split(' ')[1];

  const ivBuffer = Buffer.from(ivString, 'hex');
  const iv = uint8arrayFromBuffer(ivBuffer);

  const cipher = createDecipheriv('aes-192-cbc', key, iv);

  const _c = cipher.update(content, 'hex', 'utf8');
  const decrypted = _c + cipher.final('utf8');

  return decrypted;
}

function uint8arrayFromBuffer(buffer) {
  const a = new Uint8Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) a[i] = buffer[i];
  return a;
}
