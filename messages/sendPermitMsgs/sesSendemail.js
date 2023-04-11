const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses"); // CommonJS import
const client = new SESClient({ region: 'us-east-1' });

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '/./../../.env') });

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

    logger.info(`Email sent: ${emailAddr} ${response.MessageId}`);
    console.log(`Email sent: ${emailAddr} ${new Date().toISOString()} ${response.MessageId}`);
  } catch (err) {
    logger.error(`Error sending email: ${emailAddr} Err: ${err}`);
    console.log(`Error sending email: ${emailAddr} Err: ${err}`);
  }
}

module.exports = sesSendemail;
