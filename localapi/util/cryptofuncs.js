import { createHmac } from 'crypto';

import "dotenv/config.js";

function getHash(encodedEmail, expires) {
  const cryptokey = process.env.email_hash_key;
  const hash = createHmac('sha1', cryptokey).update(`${encodedEmail}${expires}`).digest('hex');
  return hash;
}

function createUnsubUrl(email) { // build a url to unsubscribe this email
  const encodedEmail = encodeURIComponent(email);
  const unsubUrl = process.env.unsub_url;

  const now = Date.now(); // milliseconds since epoch
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000; // in ms
  const thirtyDaysFromNow = now + THIRTY_DAYS;

  const hash = getHash(encodedEmail, thirtyDaysFromNow);
  const fullUrl = `${unsubUrl}?e=${encodedEmail}&x=${thirtyDaysFromNow}&h=${hash}`;
  return fullUrl;
}

export { getHash, createUnsubUrl };
