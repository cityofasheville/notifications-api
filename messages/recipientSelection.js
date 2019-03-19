const pug = require('pug');
const getDbConnection = require('../common/db');
const note_pool = getDbConnection('note');

const compiledFunction = pug.compileFile(__dirname + '/template.pug');


async function recipientSelection(){
  try {
    const note_client = await note_pool.connect();
   
    const tags = await note_client.query(`
    select distinct send_types.type, send_types.email, send_types.phone, topics.name, topics.permit_num
    from note.people
    INNER JOIN note.send_types
      ON people.id = send_types.user_id
    INNER JOIN note.subscriptions
      ON people.id = subscriptions.user_id	
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
         (ST_Distance_Sphere(ST_MakePoint(people.location_x, people.location_y),ST_MakePoint(topics.location_x, topics.location_y)) / 1609.34) 
         < subscriptions.radius_miles
        )
        )
        ORDER BY type, email, name;
    `);
    const tag_rows = tags.rows;

    let recipients = {};
    tag_rows.forEach(function(row){
      let list = recipients[row.email];

      if(list) {
          list.push(row);
      } else {
        recipients[row.email] = [row];
      }
    });
    console.log(recipients);
    Object.keys(recipients).forEach(key => {
      let recipient = recipients[key];
      console.log('sendto:', recipient[0].email);
      for( row of recipient){
        console.log(compiledFunction({
          name: row.name,
          permit_num: row.permit_num
        }));
      }
    });
    note_client.release();
    return Promise.resolve(0);
  } catch (e) { 
    return Promise.reject(e);
  }
};

module.exports = recipientSelection;




