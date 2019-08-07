const AWS = require('aws-sdk');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '/./../../.env') });

AWS.config.update({ region: 'us-east-1' });



function sesSendemail(emailAddr, htmlEmail, callback) {
  let params = {
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

  callback(`${params.Destination.ToAddresses[0]} ${params.Message.Body.Html.Data}\n`);
  // Create the promise and SES service object
  // sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

  // // Handle promise's fulfilled/rejected states
  // sendPromise.then(
  //   (data) => {
  //     callback(`Email sent: ${JSON.stringify(params)} ${data.MessageId}`);
  //   },
  // ).catch((err) => {
  //   callback(`Error sending email: ${emailAddr} Err: ${err}`);
  // });
}

module.exports = sesSendemail;
