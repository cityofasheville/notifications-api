// Returns objects shaped like this:
// { 'user@ashevillenc.gov':
//   [
//     { type: 'EMAIL',
//       email: 'user@ashevillenc.gov',
//       phone: null,
//       name: '30 Watauga Street Subdivision',
//       permit_num: '19-03813PZ' },
// ...
const getDbConnection = require('../../common/db');

const notePool = getDbConnection('note');

// Finds who to send email to based on thier subscribed tags and radiuses, and project locations
async function recipientSelection() {
  return new Promise(async (resolve, reject) => {
    const noteClient = await notePool.connect();
    try {
      const tags = await noteClient.query(`
      select distinct send_types.type, send_types.email, send_types.phone, topics.name, topics.permit_num
      from note.user_preferences
      INNER JOIN note.send_types
        ON user_preferences.id = send_types.user_id
      INNER JOIN note.subscriptions
        ON user_preferences.id = subscriptions.user_id
      INNER JOIN note.tags
        ON subscriptions.tag_id = tags.id
      INNER JOIN note.topic_tags
        ON tags.id = topic_tags.tag_id
      INNER JOIN note.topics
        ON topic_tags.topic_id = topics.id
      where ( 
          (subscriptions.whole_city = true) 
          or 
          (
          (ST_Distance_Sphere(ST_MakePoint(user_preferences.location_x, user_preferences.location_y),ST_MakePoint(topics.location_x, topics.location_y)) / 1609.34) 
          < subscriptions.radius_miles
          )
          )
          ORDER BY type, email, name;
      `);
      const tagRows = tags.rows;

      // build recipients object grouped by email
      const recipients = {};
      Promise.all(
        tagRows.map(async (row) => {
          const shortRow = {
            type: row.type, phone: row.phone, name: row.name, permit_num: row.permit_num,
          };
          const list = recipients[row.email];
          if (list) {
            list.push(shortRow);
          } else {
            recipients[row.email] = [shortRow];
          }
        }),
      ).then(() => {
        resolve(recipients);
      });
    } catch (e) {
      reject(e);
    } finally {
      noteClient.release();
    }
  });
}

// This allows module to be called directly from command line for testing
if (require.main === module) {
  recipientSelection().then(
    // eslint-disable-next-line no-console
    result => console.log(result),
  );
}

module.exports = recipientSelection;
