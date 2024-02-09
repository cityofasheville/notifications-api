// Returns objects shaped like this:
// { 'user@ashevillenc.gov':
//   [
//     { type: 'EMAIL',
//       email: 'user@ashevillenc.gov',
//       phone: null,
//       name: '30 Watauga Street Subdivision',
//       permit_num: '19-03813PZ' },
// ...
import getDbConnection from '../util/db.js';

const notePool = getDbConnection('note');

// Finds who to send email to based on thier subscribed tags and radiuses, and project locations
async function recipientSelection() {
  return new Promise(async (resolve, reject) => {
    const noteClient = await notePool.connect();
    try {
      const tags = await noteClient.query(`
      with permits as (
        select permit_num, "name", x, y, replace("tag"::text, '"', '') as "tag"
        from note.notification_permits p
        CROSS JOIN LATERAL JSONB_ARRAY_ELEMENTS(p.tags) as "tag" --expand array in jsonb
        where applied_date::date = '2023-07-12 00:00:00.000'::date
        --where applied_date::date = current_date - '1 days'::interval
        )
      select type, email, phone, name, permit_num, STRING_AGG(notification_type,',') as notification_type from (
        select distinct send_types.type, send_types.email, send_types.phone, permits.name, permits.permit_num, tags.name as notification_type
        from note.user_preferences
        INNER JOIN note.send_types
          ON user_preferences.id = send_types.user_id
        INNER JOIN note.subscriptions
          ON user_preferences.id = subscriptions.user_id
        INNER JOIN note.tags
          ON subscriptions.tag_id = tags.id
        INNER JOIN permits
          ON tags.name = permits."tag"
        where 
        ( 
            (subscriptions.whole_city = true) 
        --            or 
        --            (
        --            (note.ST_DistanceSphere(note.ST_MakePoint(user_preferences.location_x, user_preferences.location_y),
        --            note.ST_MakePoint(permits.x, permits.y)) / 1609.34) 
        --            < subscriptions.radius_miles
        --            )
          )
         ) as subq
         group by type, email, phone, name, permit_num
        ORDER BY type, email, name;
      `);
      const tagRows = tags.rows;

      // build recipients object grouped by email
      const recipients = {};
      Promise.all(
        tagRows.map(async (row) => {
          const shortRow = {
            type: row.type, phone: row.phone, name: row.name, permit_num: row.permit_num, notification_type: row.notification_type,
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

export default recipientSelection;
