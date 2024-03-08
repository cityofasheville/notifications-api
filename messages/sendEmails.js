import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
const client = new SESClient({ region: 'us-east-1' });

import { compileFile } from 'pug';
import { join } from 'path';
import "dotenv/config.js";
import { createUnsubUrl } from './util/cryptofuncs.js';

const __dirname = import.meta.dirname;
const compiledFunction = compileFile(join(__dirname, '/email.pug'));

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function sendEmails(recipients) {
  try {
    // eslint-disable-next-line no-restricted-syntax
    for await (const emailAddr of Object.keys(recipients)) {
      // eslint-disable-next-line no-await-in-loop
      await sleep(300);
      const recipient = {};
      recipient.listOfTopics = recipients[emailAddr];
      recipient.unsub_url = createUnsubUrl(emailAddr);
      const htmlEmail = compiledFunction(recipient);
      // eslint-disable-next-line no-await-in-loop
      await sesSendemail(emailAddr, htmlEmail);
    }
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
}

async function sesSendemail(emailAddr, htmlEmail) {
  try {
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

    console.log(`Email sent: ${emailAddr} ${new Date().toISOString()} ${response.MessageId}`);
  } catch (err) {
    console.log(`Error sending email: ${emailAddr} Err: ${err}`);
  }
}

export default sendEmails;
