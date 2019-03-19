/* Run this to create and send emails */
const loadPermits = require('./loadPermits');
const recipientSelection = require('./recipientSelection');

async function sendPermitMsgs() {
  try {
    await loadPermits();
    await recipientSelection();
  } catch (e) { 
    console.error(e); 
  }
}

module.exports = sendPermitMsgs;
