/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

import { URL } from 'url';
import { dbAll, dbGet, dbRun, dbRunIns } from '../util/sqlite.js';
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
  return (cData.email === email && cData?.sessionState?.loggedIn === true);
}

async function setUpUser(args) {
  // If the user exists, get their id and location, and update their location if it was sent.
  // If the user doesn't exist, create them and send a confirmation email.
  const user = args.user_preference;
  const emailsendtype = user.send_types.find(sendtype => sendtype.type === 'EMAIL');
  let row = await dbGet(`
        SELECT u.id, u.location_x, u.location_y FROM user_preferences u
        inner join send_types on u.id = send_types.user_id
        where send_types.user_id is not null and send_types.email = $1
        `, [emailsendtype.email]);
  if (row) { // already exist
    if (user.location_x && user.location_y) {
      await dbRun(`
              update user_preferences set location_x = $1, location_y = $2 where id = $3;
              `, [user.location_x, user.location_y, row.id]);
    }
    return {
      "userId": row.id,
      "location_x": user.location_x,
      "location_y": user.location_y
    };
  } else { // new
    sendConfirmationEmail(emailsendtype.email);
    let location_x = user.location_x || null;
    let location_y = user.location_y || null;
    let userId = await dbRunIns(`
            insert into user_preferences(location_x, location_y)VALUES($1, $2);
            `, [location_x, location_y]);
    return {
      userId,
      location_x,
      location_y
    };
  }
}

async function createUserPreference(obj, args, context) {
  if (!await validateLoggedInUser(context, args.email)) {
    return ({ "id": "invalid", "send_types": [{ "email": "Not logged in" }] });
  }

  try {
    const moo = await setUpUser(args);
    const { userId, location_x, location_y } = moo;

    // insert send types
    if (args.user_preference.send_types) {
      await dbRun(`
                    delete from send_types
                    where send_types.user_id = $1
                    `, [userId]);
      await Promise.all(args.user_preference.send_types.map(async (sendType) => {
        await dbRun(`
                      insert into send_types(user_id, type, email, phone)
                      VALUES($1, $2, $3, $4);
                      `, [userId, sendType.type, sendType.email, sendType.phone]);
      }));
    }

    // insert subscriptions
    if (args.user_preference.subscriptions) {
      await dbRun(`
                    delete from subscriptions
                    where subscriptions.user_id = $1
                    `, [userId]);
      await Promise.all(args.user_preference.subscriptions.map(async (subscription) => {
        await dbRun(`
                        insert into subscriptions(user_id, tag_id, radius_miles, whole_city)
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
        let row = dbGet(`
        select send_types.user_id from send_types where email = $1;
        `, [decodedEmail]);
        if (row) {
          const userId = row.user_id;
          dbRun(`
            delete from subscriptions where user_id = $1;
            `, [userId]);
          dbRun(`
            delete from send_types where user_id = $1;
            `, [userId]);
          dbRun(`
            delete from user_preferences where id = $1;
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
        return ({ "id": "invalid", "send_types": [{ "email": "No results: Not logged in" }] });
      }
      let rows = await dbGet(`
          SELECT u.id, u.location_x, u.location_y FROM user_preferences u
          inner join send_types on u.id = send_types.user_id
          where send_types.user_id is not null and send_types.email = $1
              `, [args.email]);
      return rows;
    },
    categories: (parent, args, context) => {
      let rows = dbAll(`
          select id, name from categories;
          `);
      return (rows);
    }
  },
  Category: {
    tags: (parent, args, context) => {
      let rows = dbAll(`
          select id, name, category_id from tags where category_id = $1
          `, [parent.id]);
      return (rows);
    }
  },
  UserPreference: {
    send_types: (parent, args, context) => {
      let rows = dbAll(`
          select id, type, email, phone from send_types where user_id = $1
          `, [parent.id]);
      return (rows);
    },
    subscriptions: (parent, args, context) => {
      let rows = dbAll(`
          select id, tag_id, radius_miles, whole_city from subscriptions where user_id = $1
          `, [parent.id]);
      return (rows);
    },
  },
  Subscription: {
    tag: (parent, args, context) => {
      let row = dbGet(`
          select id, name, category_id from tags where id = $1
          `, [parent.tag_id]);
      return (row);
    },
  },
  Mutation: {
    createUserPreference,
    updateUserPreference,
    deleteUserPreferenceSecure,
  },
};

export default resolvers;
