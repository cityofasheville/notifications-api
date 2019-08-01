/* Run this to create and send emails */
const loadPermits = require('./loadPermits'); // Loads permits from Simplicity into Notifications DB
const recipientSelection = require('./recipientSelection'); // Finds who to send email to
const sendEmails = require('./sendEmails'); // Send em

async function sendPermitMsgs() {
  try {
    await loadPermits();
    const recipients = await recipientSelection();
    sendEmails(recipients);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

module.exports = sendPermitMsgs;
