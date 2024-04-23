// This was used to port the user data from the old database to the new database

// "pubrecdb1.cd9h9tveyb58.us-east-1.rds.amazonaws.com"

import pg from 'pg';
const { Pool } = pg;
const OLDpool = new Pool({
  connectionString: "postgres://dbadmin:password@pubrecdb1.cd9h9tveyb58.us-east-1.rds.amazonaws.com:5432/notifications"
});
const NEWpool = new Pool({
  connectionString: "postgres://dbadmin:password@pubrecdb1.cd9h9tveyb58.us-east-1.rds.amazonaws.com:5432/note"
});


let { rows } = await OLDpool.query(`
      SELECT u.id, u.location_x, u.location_y FROM note.user_preferences u;
      `);
for (const row of rows) {

  let { rows: newUpRows } = await NEWpool.query(`
      insert into note.user_preferences(location_x, location_y)
      VALUES($1, $2) returning id;
      `, [row.location_x, row.location_y]);
      console.log(newUpRows);
  let old_user_id = row.id;
  let new_user_id = newUpRows[0].id;
  let { rows: rows1 } = await OLDpool.query(`
  SELECT user_id, type, email, phone FROM note.send_types
  where user_id = $1
  `, [old_user_id]);
  if(rows1.length > 0) {
    for (const sendType of rows1) {
      await NEWpool.query(`
                    insert into note.send_types(user_id, type, email, phone)
                    VALUES($1, $2, $3, $4);
                    `, [new_user_id, sendType.type, sendType.email, sendType.phone]);
    };
  }

  let { rows: rows2 } = await OLDpool.query(`
  SELECT tag_id, radius_miles, whole_city FROM note.subscriptions
  where user_id = $1
  `, [old_user_id]);
  if(rows2.length > 0) {
    for (const subscription of rows2) {
      await NEWpool.query(`
                    insert into note.subscriptions(user_id, tag_id, radius_miles, whole_city)
                    VALUES($1, $2, $3, $4);
                    `, [new_user_id, subscription.tag_id, subscription.radius_miles, subscription.whole_city]);
    };
  }

};

