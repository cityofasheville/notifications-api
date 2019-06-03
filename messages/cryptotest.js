// This is how I will build the unsubscribe link in the email

const crypto = require('crypto');

function getHash(encodedEmail,expires){
  const cryptokey = 'anothersupersecrethashkey'
  const hash = crypto.createHmac('sha1', cryptokey).update(encodedEmail + '' + expires).digest('hex');
  return hash;
}

function createUnsubURL(email){ // build a url to unsubscribe this email
  const encodedEmail = encodeURIComponent(email);
  const unsubUrl = 'https://ashevillenc.gov/unsubscribe/'
  
  var now = Date.now(); //milliseconds since epoch
  var THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000; // in ms
  var thirtyDaysFromNow = now + THIRTY_DAYS; 

  const hash = getHash(encodedEmail,thirtyDaysFromNow)
  const fullUrl = unsubUrl + '?e=' + encodedEmail + '&x=' + thirtyDaysFromNow + '&h=' + hash;
  return fullUrl;
}


const testUrl = createUnsubURL('jtwilson@ashevillenc.gov');

console.log('testUrl: ',testUrl);

const urlObj = new URL(testUrl);

const decodedEmail = urlObj.searchParams.get('e'); //this func seems to decode?
const encodedEmail = encodeURIComponent(decodedEmail);
console.log(encodedEmail,decodedEmail);

const urlExpireEpoch = urlObj.searchParams.get('x');
if (urlExpireEpoch > Date.now()) { 
  console.log("Not expired: ", urlExpireEpoch, Date.now());
}else{
  console.log("Expired: ", urlExpireEpoch, Date.now());
}

const urlHash = urlObj.searchParams.get('h');
const hashShouldBe = getHash(encodedEmail,urlExpireEpoch)
if(hashShouldBe === urlHash){
  console.log('Hashes match: ',hashShouldBe,' = ',urlHash);
}else{
  console.log('No match: ',hashShouldBe,' = ',urlHash);
}