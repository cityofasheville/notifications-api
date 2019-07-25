const crypto = require('crypto');
require('dotenv').config();

function getHash(encodedEmail,expires){
  const cryptokey = process.env.email_hash_key;
  const hash = crypto.createHmac('sha1', cryptokey).update(encodedEmail + '' + expires).digest('hex');
  return hash;
}

function createunsub_url(email){ // build a url to unsubscribe this email
  const encodedEmail = encodeURIComponent(email);
  const unsub_url = process.env.unsub_url;
  
  var now = Date.now(); //milliseconds since epoch
  var THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000; // in ms
  var thirtyDaysFromNow = now + THIRTY_DAYS; 

  const hash = getHash(encodedEmail,thirtyDaysFromNow)
  const fullUrl = unsub_url + '?e=' + encodedEmail + '&x=' + thirtyDaysFromNow + '&h=' + hash;
  return fullUrl;
}

module.exports = { getHash, createunsub_url };

