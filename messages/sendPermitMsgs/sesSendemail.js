const AWS = require('aws-sdk');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '/./../../.env') });

AWS.config.update({ region: 'us-east-1' });

const params = {
  Destination: { /* required */
    ToAddresses: [
      '',
    ],
  },
  Message: { /* required */
    Body: { /* required */
      Html: {
        Charset: 'UTF-8',
        Data: '',
      },
      Text: {
        Charset: 'UTF-8',
        Data: '',
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

function sesSendemail(emailAddr, htmlEmail, callback) {
  params.Destination.ToAddresses[0] = emailAddr;
  params.Message.Body.Html.Data = htmlEmail;
  params.Message.Body.Text.Data = htmlEmail; // TODO: plain text

  // Create the promise and SES service object
  const sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

  // Handle promise's fulfilled/rejected states
  sendPromise.then(
    (data) => {
      callback(`Email sent: ${emailAddr} ${data.MessageId}`);
    },
  ).catch((err) => {
    callback(`Error sending email: ${emailAddr} Err: ${err}`);
  });
}

module.exports = sesSendemail;
