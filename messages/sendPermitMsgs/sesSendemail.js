const { SES } = require("@aws-sdk/client-ses");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '/./../../.env') });

AWS.config.update({ region: 'us-east-1' });

function sesSendemail(emailAddr, htmlEmail, callback) {
  const params = {
    Destination: { /* required */
      ToAddresses: [emailAddr],
    },
    Message: { /* required */
      Body: { /* required */
        Html: {
          Charset: 'UTF-8',
          Data: htmlEmail,
        },
        Text: {
          Charset: 'UTF-8',
          Data: htmlEmail,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'City of Asheville Notifications',
      },
    },
    Source: process.env.email_sender, /* required */
    ReplyToAddresses: [
      process.env.email_sender,
    ],
  };

  // Create the promise and SES service object
  const sendPromise = new SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

  // Handle promise's fulfilled/rejected states
  sendPromise.then(
    (data) => {
      callback(`Email sent: ${emailAddr} ${new Date().toISOString()} ${data.MessageId}`);
    },
  ).catch((err) => {
    callback(`Error sending email: ${emailAddr} Err: ${err}`);
  });
}

module.exports = sesSendemail;
