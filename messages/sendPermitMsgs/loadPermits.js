
const getDbConnection = require('../../common/db');
const mds_pool = getDbConnection('mds');   // MDAStore DB has permits
const note_pool = getDbConnection('note'); //Notification DB has user_preferences

// Loads permits from Simplicity into Notifications DB
async function loadPermits() {
  try {
    const mds_client = await mds_pool.connect();
    const note_client = await note_pool.connect();
    await note_client.query(`delete from note.messages;`);    
    await note_client.query(`delete from note.topic_tags;`);    
    await note_client.query(`delete from note.topics;`);    
    const tags = await note_client.query(`
    select id, name from note.tags;
    `);
    const tagRows = tags.rows;
    const permits = await mds_client.query(`
      SELECT tag, permit_num, applied_date, "name", x, y
      FROM internal.notification_emails
      where applied_date >= NOW() - '16 days'::interval
    `);
    for(row of permits.rows){
      const topics = await note_client.query(`
      INSERT INTO note.topics
      ("name", permit_num, location_x, location_y)
      VALUES($1, $2, $3, $4) RETURNING id;
      `, [ row.name, row.permit_num, row.x, row.y ]);
      const topic_id = topics.rows[0].id;
      const topics_tag = tagRows.find(tagrow=>{ // get the id of the matching tag (Major, Minor, etc)
        return row.tag===tagrow.name;
      })
      const tag_id = topics_tag.id;
      await note_client.query(`
      INSERT INTO note.topic_tags
      (tag_id, topic_id)
      VALUES($1, $2);
      `, [ tag_id, topic_id ]);      
    }
    mds_client.release();
    note_client.release();
    return Promise.resolve(0);
  } catch (e) { 
    return Promise.reject(e);
  }
}

module.exports = loadPermits;



