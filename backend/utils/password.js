// CUS-BE-04: Password hashing
// Uses Node's built-in crypto (scrypt), so no extra package is needed.
// Stored format: "<salt>:<hash>", both in hex.

const crypto = require('crypto');

const KEY_LENGTH = 64;

function hashPassword(plainPassword) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(plainPassword, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
}

function comparePassword(plainPassword, storedPassword) {
  if (!plainPassword || !storedPassword || !storedPassword.includes(':')) {
    return false;
  }
  const [salt, hash] = storedPassword.split(':');
  const storedHash = Buffer.from(hash, 'hex');
  const testHash = crypto.scryptSync(plainPassword, salt, KEY_LENGTH);
  return storedHash.length === testHash.length && crypto.timingSafeEqual(storedHash, testHash);
}

module.exports = { hashPassword, comparePassword };
