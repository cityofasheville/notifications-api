// This is how I will build the unsubscribe link in the email

const crypto = require('crypto');
const URL = require('url').URL;

const unsubUrl = 'https://ashevillenc.gov/unsubscribe/'

var now = Date.now(); //milliseconds since epoch
var THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000; // in ms
var thirtyDaysFromNow = now + THIRTY_DAYS; 

console.log(now, THIRTY_DAYS, thirtyDaysFromNow);

const emailaddress = encodeURIComponent('jtwilson@ashevillenc.gov');

const key = 'anothersupersecrethashkey'

const hash = crypto.createHmac('sha1', key).update(emailaddress + '' + thirtyDaysFromNow).digest('hex');

const fullUrl = unsubUrl + '?e=' + emailaddress + '&x=' + thirtyDaysFromNow + '&h=' + hash

console.log(fullUrl);

const urlObj = new URL(fullUrl);

const getemail = urlObj.searchParams.get('e');
console.log(getemail);

const getexpires = urlObj.searchParams.get('x');
console.log(new Date(parseInt(getexpires, 10)).toString());

const gethash = urlObj.searchParams.get('h');
console.log(hash,gethash);

