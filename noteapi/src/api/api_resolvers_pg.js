/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

import { URL } from 'url';
import { getHash } from '../util/cryptofuncs.js';
import sendConfirmationEmail from './confirmationEmail/sendConfirmationEmail.js';

// Simple email validation that should not cause false negatives 
function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

async function validateLoggedInUser(context, email) {
  if (context.debug) return true;
  if (!validateEmail(email)) return false;
  // Return true if the user is logged in, and the logged in email matches the request.
  let cData = await context.cache.get(context.session.id);
  let results = (cData.email === email && cData?.sessionState?.loggedIn === true);
  return results;
}

async function setUpUser(useremail, user, pool) {
  // If the user exists, get their id and location, and update their location if it was sent.
  // If the user doesn't exist, create them and send a confirmation email.
  let { rows } = await pool.query(`
        SELECT u.id, u.location_x, u.location_y FROM note.user_preferences u
        inner join note.send_types on u.id = send_types.user_id
        where send_types.user_id is not null and send_types.email = $1
        `, [useremail]);
  if (rows[0]) { // already exist
    let row = rows[0];
    if (user.location_x && user.location_y) {
      await pool.query(`
              update note.user_preferences set location_x = $1, location_y = $2 where id = $3;
              `, [user.location_x, user.location_y, row.id]);
    }
    return {
      "userId": row.id,
      "location_x": user.location_x,
      "location_y": user.location_y
    };
  } else { // new
    sendConfirmationEmail(useremail);
    let location_x = user.location_x || null;
    let location_y = user.location_y || null;
    let { rows: newUpRows } = await pool.query(`
            insert into note.user_preferences(location_x, location_y)VALUES($1, $2) returning id;
            `, [location_x, location_y]);
    return {
      userId: newUpRows[0].id,
      location_x,
      location_y
    };
  }
}

async function createUserPreference(obj, args, context) {
  const user = args.user_preference;
  const emailsendtype = user.send_types.find(sendtype => sendtype.type === 'EMAIL');
  const useremail = emailsendtype.email;
  if (!await validateLoggedInUser(context, useremail)) {
    return ({ "id": -1, "send_types": [{ "email": "Not logged in" }] });
  }

  try {
    const pool = context.pool;
    const { userId, location_x, location_y } = await setUpUser(useremail, user, pool);

    // insert send types
    if (args.user_preference.send_types) {
      await pool.query(`
                    delete from note.send_types
                    where send_types.user_id = $1
                    `, [userId]);
      await Promise.all(args.user_preference.send_types.map(async (sendType) => {
        await pool.query(`
                      insert into note.send_types(user_id, type, email, phone)
                      VALUES($1, $2, $3, $4);
                      `, [userId, sendType.type, sendType.email, sendType.phone]);
      }));
    }

    // insert subscriptions
    if (args.user_preference.subscriptions) {
      await pool.query(`
                    delete from note.subscriptions
                    where subscriptions.user_id = $1
                    `, [userId]);
      await Promise.all(args.user_preference.subscriptions.map(async (subscription) => {
        await pool.query(`
                        insert into note.subscriptions(user_id, tag_id, radius_miles, whole_city)
                        VALUES($1, $2, $3, $4);
                        `, [userId, subscription.tag.id, subscription.radius_miles, subscription.whole_city]);
      }));
    }

    return Object.assign({}, args.user_preference, { id: userId, location_x, location_y });
  } catch (e) { console.log(e); throw (e); }
}

async function updateUserPreference(obj, args, context) {
  return createUserPreference(obj, args, context);
}

async function deleteUserPreferenceSecure(obj, args, context) {
  const pool = context.pool;
  const ret = {};
  ret.error = null;
  const urlObj = new URL(args.url);
  try {
    const decodedEmail = urlObj.searchParams.get('e');
    ret.deletedEmail = decodedEmail;
    const encodedEmail = encodeURIComponent(decodedEmail);
    const urlHash = urlObj.searchParams.get('h');
    const urlExpireEpoch = urlObj.searchParams.get('x');
    const hashShouldBe = getHash(encodedEmail, urlExpireEpoch);
    if (urlExpireEpoch > Date.now()) { // not expired
      if (hashShouldBe === urlHash) { // hash matches
        let { rows } = await pool.query(`
        select send_types.user_id from note.send_types where email = $1;
        `, [decodedEmail]);
        if (rows[0]) {
          const row = rows[0];
          const userId = row.user_id;
          await pool.query(`
          delete from note.subscriptions where user_id = $1;
          `, [userId]);
          await pool.query(`
          delete from note.send_types where user_id = $1;
          `, [userId]);
          await pool.query(`
          delete from note.user_preferences where id = $1;
          `, [userId]);
        } else {
          ret.error = 'BADHASH';
        }
      } else {
        ret.error = 'BADHASH';
      }
    } else {
      ret.error = 'EXPIRED';
    }
    return (ret);
  } catch (e) { console.log(e); throw (e); }
}

const resolvers = {
  Query: {
    user_preference: async (parent, args, context) => {
      // gets a user_preference, their subscriptions, and their send types, given an email.
      if (!await validateLoggedInUser(context, args.email)) {
        return ({ "id": -1, "send_types": [{ "email": "No results: Not logged in" }] });
      }
      let { rows } = await context.pool.query(`
          SELECT u.id, u.location_x, u.location_y FROM note.user_preferences u
          inner join note.send_types on u.id = send_types.user_id
          where send_types.user_id is not null and send_types.email = $1
              `, [args.email]);
      const ret = rows[0] ? rows[0]: null;
      return (ret);
    },
    categories: async (parent, args, context) => {
      let { rows } = await context.pool.query(`
          select id, name from note.categories;
          `);
      return (rows);
    }
  },
  Category: {
    tags: async (parent, args, context) => {
      let { rows } = await context.pool.query(`
          select id, name, category_id from note.tags where category_id = $1
          `, [parent.id]);
      return (rows);
    }
  },
  UserPreference: {
    send_types: async (parent, args, context) => {
      let { rows } = await context.pool.query(`
          select id, type, email, phone from note.send_types where user_id = $1
          `, [parent.id]);
      return (rows);
    },
    subscriptions: async (parent, args, context) => {
      let { rows } = await context.pool.query(`
          select id, tag_id, radius_miles, whole_city from note.subscriptions where user_id = $1
          `, [parent.id]);
      return (rows);
    },
  },
  Subscription: {
    tag: async (parent, args, context) => {
      let { rows } = await context.pool.query(`
          select id, name, category_id from note.tags where id = $1
          `, [parent.tag_id]);
      return (rows[0]);
    },
  },
  Mutation: {
    createUserPreference,
    updateUserPreference,
    deleteUserPreferenceSecure,
  },
};

export default resolvers;
