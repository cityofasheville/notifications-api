/* eslint-disable no-console */
const AWS = require('aws-sdk');
const pug = require('pug');
const path = require('path');
const Logger = require('coa-node-logging');
const cryptofuncs = require('../../api/cryptofuncs');

require('dotenv').config({ path: path.join(__dirname, '/./../../.env') });

AWS.config.update({ region: 'us-east-1' });

const logFile = './logfile.log';
const name = 'signup-confirmation-email';
const logger = new Logger(name, logFile);

const compiledFunction = pug.compileFile(path.join(__dirname, '/email.pug'));

function sendConfirmationEmail(emailAddr) {
  const recipient = {};
  recipient.unsub_url = cryptofuncs.createUnsubUrl(emailAddr);
  const htmlEmail = compiledFunction(recipient);
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
  const sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

  // Handle promise's fulfilled/rejected states
  sendPromise.then(
    (data) => {
      logger.info(`Email sent: ${emailAddr} ${data.MessageId}`);
      console.log(`Email sent: ${emailAddr} ${data.MessageId}`);
    },
  ).catch((err) => {
    logger.error(`Error sending email: ${emailAddr} Err: ${err}`);
    console.log(`Error sending email: ${emailAddr} Err: ${err}`);
  });
}

module.exports = sendConfirmationEmail;
