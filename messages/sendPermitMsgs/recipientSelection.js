// Returns objects shaped like this:
// { 'jtwilson@ashevillenc.gov':
//   [ 
//     { type: 'EMAIL',
//       email: 'jtwilson@ashevillenc.gov',
//       phone: null,
//       name: '30 Watauga Street Subdivision',
//       permit_num: '19-03813PZ' },
// ...


const getDbConnection = require('../../common/db');
const notePool = getDbConnection('note');

// Finds who to send email to based on thier subscribed tags and radiuses, and project locations
async function recipientSelection() {
  try {
    const noteClient = await notePool.connect();
   
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
    let recipients = {};
    tagRows.forEach(function(row){
      let list = recipients[row.email];
      if(list) {
          list.push(row);
      } else {
        recipients[row.email] = [row];
      }
    });

console.log(recipients);

    noteClient.release();
    return Promise.resolve(recipients);
  } catch (e) { 
    return Promise.reject(e);
  }
};

module.exports = recipientSelection;




