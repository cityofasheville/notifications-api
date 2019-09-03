const pug = require('pug');
const path = require('path');
const Logger = require('coa-node-logging');
const sesS = require('./sesS');
const cryptofuncs = require('../../api/cryptofuncs');

const logFile = './logfile.log';
const name = 'email-logger';
const logger = new Logger(name, logFile);

const compiledFunction = pug.compileFile(path.join(__dirname, '/email.pug'));

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function sendEmails(recipients) {
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const emailAddr of Object.keys(recipients)) {
    // Object.keys(recipients).map(async (emailAddr) => {
      // eslint-disable-next-line no-await-in-loop
      await sleep(1000);
      const recipient = {};
      recipient.listOfTopics = recipients[emailAddr];
      recipient.unsub_url = cryptofuncs.createUnsubUrl(emailAddr);
      const htmlEmail = compiledFunction(recipient);
      // eslint-disable-next-line no-await-in-loop
      await sesS(emailAddr, htmlEmail, (returnmsg) => {
        logger.info(returnmsg);
        // eslint-disable-next-line no-console
        console.log(returnmsg);
      });
    };
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
}

module.exports = sendEmails;
