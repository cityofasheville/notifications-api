const pug = require('pug');
const path = require('path');
const fs = require('fs');
const sesSendemail = require('./sesSendemail');
const cryptofuncs = require('../../api/cryptofuncs');

const compiledFunction = pug.compileFile(path.join(__dirname, '/email.pug'));

async function sendEmails(recipients) {
  const logFile = fs.createWriteStream('./logfile.log');
  try {
    // send emails
    Object.keys(recipients).forEach((emailAddr) => {
      const recipient = {};
      recipient.listOfTopics = recipients[emailAddr];
      recipient.unsub_url = cryptofuncs.createUnsubUrl(emailAddr);
      const htmlEmail = compiledFunction(recipient);
      sesSendemail(emailAddr, htmlEmail, (returnmsg) => {
        // eslint-disable-next-line no-console
        console.log(returnmsg);
        console.log(JSON.stringify(recipient));
        logFile.write(`${returnmsg}\n`);
      });
    });
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
}

module.exports = sendEmails;
