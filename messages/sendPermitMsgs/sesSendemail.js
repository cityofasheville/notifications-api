const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const client = new SESClient({ region: 'us-east-1' });

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '/./../../.env') });


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

// This allows module to be called directly from command line for testing
if (require.main === module) {
  sesSendemail("jtwilson@ashevillenc.gov", 
  `<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta name="x-apple-disable-message-reformatting"/><title>Development Notification</title><style> .red {
    color: red; } .box { border: 1px solid rgb(192, 82, 82); padding: 20px; margin: 10%; } .tablecenter { margin-left: auto; margin-right: auto; text-align: left; }
  </style> </head> <body> <div class="box"> <h1>New land development proposed in Asheville</h1> <p>The City of Asheville began processing the following land development applications yesterday. Click on a project name to view details.</p><br /> <table class="tablecenter"> <tr> <td> <a href="https://simplicity.ashevillenc.gov/permits/search">Search </a></td> <td>Minor </td> </tr> </table><br /><br /><br /> <p>You are receiving this email because you signed up for notifications. No longer interested?</p><br /> <ul> <li><a href="#">Unsubscribe</a> </li> <li><a href="https://notifications.ashevillenc.gov">Change your preferences</a></li> <li><a href="https://simplicity.ashevillenc.gov/development/major">Learn more about large-scale development in Asheville</a></li> </ul><br /><br /> </div> <h2 class="box"><span class="red">NEW! </span><span>There is a new notification type that you can sign up for: </span><span class="red">Sound Exceedance</span> <ul> <li><a href="https://notifications.ashevillenc.gov">Log in to sign up </a></li> </ul> </h2> </body> </html>`
  )
}

module.exports = sesSendemail;
