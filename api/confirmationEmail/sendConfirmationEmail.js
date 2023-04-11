/* eslint-disable no-console */
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses"); // CommonJS import
const client = new SESClient({ region: 'us-east-1' });

const pug = require('pug');
const path = require('path');
const Logger = require('coa-node-logging');
const cryptofuncs = require('../../api/cryptofuncs');

require('dotenv').config({ path: path.join(__dirname, '/./../../.env') });

const logFile = './logfile.log';
const name = 'signup-confirmation-email';
const logger = new Logger(name, logFile);

const compiledFunction = pug.compileFile(path.join(__dirname, '/email.pug'));

async function sendConfirmationEmail(emailAddr) {
  try {
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

    const command = new SendEmailCommand(params);
    const response = await client.send(command);

    logger.info(`Email sent: ${emailAddr} ${response.MessageId}`);
    console.log(`Email sent: ${emailAddr} ${response.MessageId}`);
  } catch (err) {
    logger.error(`Error sending email: ${emailAddr} Err: ${err}`);
    console.log(`Error sending email: ${emailAddr} Err: ${err}`);
  }
}
module.exports = sendConfirmationEmail;

