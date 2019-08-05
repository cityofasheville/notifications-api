const crypto = require('crypto');
require('dotenv').config();

function getHash(encodedEmail, expires) {
  const cryptokey = process.env.email_hash_key;
  const hash = crypto.createHmac('sha1', cryptokey).update(`${encodedEmail}${expires}`).digest('hex');
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

// This allows module to be called directly from command line for testing
if (require.main === module) {
  // eslint-disable-next-line no-console
  console.log(createUnsubUrl('jtwilson@ashevillenc.gov'));
}
module.exports = { getHash, createUnsubUrl };
