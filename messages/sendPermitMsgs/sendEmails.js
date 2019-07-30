const pug = require('pug');
const path = require('path');
const ses_sendemail = require('./ses_sendemail');
const cryptofuncs = require('../../api/cryptofuncs');
const fs = require('fs');

const compiledFunction = pug.compileFile(path.join(__dirname, '/email.pug'));

async function sendEmails(recipients) {
    logFile = fs.createWriteStream('./logfile.log');
    try {
        // send emails
        Object.keys(recipients).forEach(emailAddr => {
            let recipient = {};
            recipient.listOfTopics = recipients[emailAddr];
            recipient.unsub_url = cryptofuncs.createunsub_url(emailAddr);
            let htmlEmail = compiledFunction(recipient);
            ses_sendemail(emailAddr,htmlEmail,returnmsg=>{
                console.log(returnmsg);
                logFile.write(returnmsg + '\n');
            });
            return;
        });
        return Promise.resolve();
    } catch (e) { 
        return Promise.reject(e);
    }
}

module.exports = sendEmails;