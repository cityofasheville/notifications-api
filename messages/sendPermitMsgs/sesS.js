const AWS = require('aws-sdk');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '/./../../.env') });

AWS.config.update({ region: 'us-east-1' });

function sesS(emailAddr, htmlEmail, callback) {
  // Create the promise and SES service object
  const sendPromise = new Promise((resolve) => {
    resolve(emailAddr);
  });

  // Handle promise's fulfilled/rejected states
  sendPromise.then(

    (data) => {
      callback(`Email sent: ${data} ${new Date().toISOString()}`);
    },
  ).catch((err) => {
    callback(`Error sending email: ${emailAddr} Err: ${err}`);
  });
}

module.exports = sesS;
