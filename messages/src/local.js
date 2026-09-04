/* Run this to create and send emails */
import recipientSelection from './recipientSelection.js'; // Finds who to send email to
import sendEmails from './sendEmails.js'; // Send em

try {
  let recipients = await recipientSelection();
  let devEmail = process.env.dev_email;
  if (process.env.use_dev === 'true' || process.env.use_dev === true) {
    recipients = {[devEmail]: recipients[devEmail]};
  }

  let count = await sendEmails(recipients);
  console.log(`Emails sent: ${count}`);
} catch (e) {
  // eslint-disable-next-line no-console
  console.error(e);
}
