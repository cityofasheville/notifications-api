/* Run this to create and send emails */
import recipientSelection from './recipientSelection.js'; // Finds who to send email to
import sendEmails from './sendEmails.js'; // Send em

export async function handler(event, context) {
  try {
    const recipients = await recipientSelection();
    let count = await sendEmails(recipients);
    console.log(`Emails sent: ${count}`);

  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}
