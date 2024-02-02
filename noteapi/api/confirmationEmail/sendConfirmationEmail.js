/* eslint-disable no-console */
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
const client = new SESClient({ region: 'us-east-1' });

import { compileFile } from 'pug';
import { join } from 'path';
import cryptofuncs from '../../api/cryptofuncs.js';
const __dirname = import.meta.dirname;
import "dotenv/config.js";

const pugfile = join(__dirname, '/email.pug');
// console.log(pugfile);
const compiledFunction = compileFile(pugfile);

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

    console.log(`Email sent: ${emailAddr} ${response.MessageId}`);
  } catch (err) {
    console.log(`Error sending email: ${emailAddr} Err: ${err}`);
  }
}
export default sendConfirmationEmail;

