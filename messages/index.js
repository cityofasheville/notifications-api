/* Run this to create and send emails */
import recipientSelection from './recipientSelection.js'; // Finds who to send email to
import sendEmails from './sendEmails.js'; // Send em

try {
  const recipients = await recipientSelection();
  sendEmails(recipients);
} catch (e) {
  // eslint-disable-next-line no-console
  console.error(e);
}

