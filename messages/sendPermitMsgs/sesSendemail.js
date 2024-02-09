import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
const client = new SESClient({ region: 'us-east-1' });

import "dotenv/config.js";


const logFile = './logfile.log';

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

export default sesSendemail;
