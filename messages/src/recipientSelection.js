// Returns objects shaped like this:
// { 'user@ashevillenc.gov':
//   [
//     { type: 'EMAIL',
//       email: 'user@ashevillenc.gov',
//       phone: null,
//       name: '30 Watauga Street Subdivision',
//       permit_num: '19-03813PZ' },
// ...
import getDbConnection from './util/db.js';

const notePool = getDbConnection('note');

// Finds who to send email to based on thier subscribed tags and radiuses, and project locations
async function recipientSelection() {
  const noteClient = await notePool.connect();
  try {
    const tags = await noteClient.query(`
      with insertedpermits as (    -- find permits not in history and insert them into history
        INSERT INTO note.notification_permits_history
        (permit_num, applied_date, "name", sent_date)
        select np.permit_num, np.applied_date, np."name", now() 
        from note.notification_permits np 
        left join note.notification_permits_history nph 
        on np.permit_num = nph.permit_num 
        where nph.permit_num is null
        returning permit_num 
      )
      ,permits as ( -- get all permits that were inserted into history and their tags
        select p.permit_num, p."name", p.x, p.y, replace(a."tag"::text, '"', '') as "tag"
        from note.notification_permits p
        inner join insertedpermits ip
        on p.permit_num = ip.permit_num
        CROSS JOIN LATERAL JSONB_ARRAY_ELEMENTS(p.tags) as a("tag") --expand array in jsonb
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
              or 
              (
              (tiger.ST_DistanceSphere(tiger.ST_MakePoint(user_preferences.location_x, user_preferences.location_y),
              tiger.ST_MakePoint(permits.x, permits.y)) / 1609.34) 
              < subscriptions.radius_miles
              )
        )
      ) as subq
      group by type, email, phone, name, permit_num
      ORDER BY type, email, name;		
      `);
    const tagRows = tags.rows;

    // build recipients object grouped by email
    const recipients = {};
    return Promise.all(
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
      return (recipients);
    });
  } catch (e) {
    throw (e);
  } finally {
    noteClient.release();
  }
}

export default recipientSelection;
