
const getDbConnection = require('../../common/db');

const mdsPool = getDbConnection('mds'); // MDAStore DB has permits
const notePool = getDbConnection('note'); // Notification DB has user_preferences

// Loads permits from Simplicity into Notifications DB
async function loadPermits() {
  return new Promise(async (resolve, reject) => {
    const mdsClient = await mdsPool.connect();
    const noteClient = await notePool.connect();
    try {
      await noteClient.query('delete from note.messages;');
      await noteClient.query('delete from note.topic_tags;');
      await noteClient.query('delete from note.topics;');
      const tags = await noteClient.query(`
      select id, name from note.tags;
      `);
      const tagRows = tags.rows;
      const permits = await mdsClient.query(`
      select tag, permit_num, applied_date, "name", x, y
      FROM internal.notification_emails
      where applied_date::date >= current_date - '10 days'::interval;
      -- where applied_date::date = current_date - '1 days'::interval;
      `);
      Promise.all(
        permits.rows.map(async (row) => {
          const topics = await noteClient.query(`
          INSERT INTO note.topics
          ("name", permit_num, location_x, location_y)
          VALUES($1, $2, $3, $4) RETURNING id;
          `, [row.name, row.permit_num, row.x, row.y]);
          const topicId = topics.rows[0].id;
          // get the id of the matching tag (Major, Minor, etc)
          const topicsTag = tagRows.find(tagrow => row.tag === tagrow.name);
          const tagId = topicsTag.id;
          await noteClient.query(`
          INSERT INTO note.topic_tags
          (tag_id, topic_id)
          VALUES($1, $2);
          `, [tagId, topicId]);
        }),
      ).then(() => {
        resolve(0);
      });
    } catch (e) {
      reject(e);
    } finally {
      mdsClient.release();
      noteClient.release();
    }
  });
}

// This allows module to be called directly from command line for testing
if (require.main === module) {
  loadPermits();
}

module.exports = loadPermits;
