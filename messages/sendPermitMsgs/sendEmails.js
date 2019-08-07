const pug = require('pug');
const path = require('path');
const Logger = require('coa-node-logging');
const sesSendemail = require('./sesSendemail');
const cryptofuncs = require('../../api/cryptofuncs');

const logFile = './logfile.log';
const name = 'email-logger';
const logger = new Logger(name, logFile);

const compiledFunction = pug.compileFile(path.join(__dirname, '/email.pug'));

async function sendEmails(recipients) {
  try {
    // send emails
    Object.keys(recipients).forEach((emailAddr) => {
      const recipient = {};
      recipient.listOfTopics = recipients[emailAddr];
      recipient.unsub_url = cryptofuncs.createUnsubUrl(emailAddr);
      const htmlEmail = compiledFunction(recipient);
      sesSendemail(emailAddr, htmlEmail, (returnmsg) => {
        logger.info(returnmsg);
      });
    });
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
}

module.exports = sendEmails;
