import { compileFile } from 'pug';
import { join } from 'path';
import sesSendemail from './sesSendemail.js';
import { createUnsubUrl } from '../util/cryptofuncs.js';

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

export default sendEmails;
