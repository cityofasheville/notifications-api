/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

const getDbConnection = require('../common/db');
const cryptofuncs = require('./cryptofuncs');

const pool = getDbConnection('note'); // Initialize the connection.

async function getMessage(parent, args, context) { // gets a message, its topic, and lists tags
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`
    select row_to_json(msg) results
    from (
      select messages.message, messages.sent, messages.datesent, 
      (
        select row_to_json(tp) results
        from (
          select topics.name, 
          (
            select array_to_json(array_agg(row_to_json(t))) 
            from (
              select tags.id, tags.category_id, tags.name
              from note.topic_tags
              inner join note.tags
              ON tags.id = topic_tags.tag_id
              WHERE topics.id = topic_id
            ) as t
          ) as tags
          from note.topics
          where topics.id = messages.topic_id
        ) tp
      ) as topic
        from note.messages
      where messages.id = $1
    ) as msg`, [args.id]);
    client.release();
    const ret = rows[0].results;
    return Promise.resolve(ret);
  } catch (e) { return Promise.reject(e); }
}

async function getCategory(parent, args, context) {
  try {
    const client = await pool.connect();
    const result = await client.query('select id, name from note.categories where id = $1', [args.id]);
    client.release();
    return Promise.resolve(result.rows[0]);
  } catch (e) { return Promise.reject(e); }
}

// gets a user_preference, their subscriptions, and their send types, given an email.
async function getUserPreference(parent, args, context) {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`
    select row_to_json(peep) results
    from (
      select user_preferences.id, user_preferences.location_x, user_preferences.location_y,
      (
        select array_to_json(array_agg(row_to_json(s))) 
        from (
          select subscriptions.id, subscriptions.radius_miles, subscriptions.whole_city, tag_id,
          (
            select row_to_json(t)
            from (
              select tags.id id, tags.category_id, tags.name
              from note.tags
              where subscriptions.tag_id = tags.id
            ) as t
          ) as tag
          from note.subscriptions
          WHERE user_preferences.id = subscriptions.user_id
        ) as s
      ) as subscriptions,
      (
        select array_to_json(array_agg(row_to_json(st))) 
        from (
          select send_types.id, send_types.type, send_types.email, 
            send_types.phone
          from note.send_types
          WHERE user_preferences.id = send_types.user_id
        ) as st
      ) as send_types        
      from note.user_preferences
      inner join note.send_types
      on user_preferences.id = send_types.user_id
      where send_types.user_id is not null
      and send_types.email = $1
    ) as peep
    `, [args.email]);
    client.release();
    const ret = rows[0] ? rows[0].results : null;
    return Promise.resolve(ret);
  } catch (e) { return Promise.reject(e); }
}

async function getTag(parent, args, context) {
  try {
    const client = await pool.connect();
    const result = await client.query('select id, name, category_id from note.tags where id = $1', [args.id]);
    client.release();
    return Promise.resolve(result.rows[0]);
  } catch (e) { return Promise.reject(e); }
}

async function getTags(parent, args, context) {
  try {
    const client = await pool.connect();
    const result = await client.query('select id, name, category_id from note.tags');
    client.release();
    return Promise.resolve(result.rows);
  } catch (e) { return Promise.reject(e); }
}

async function getTopics(parent, args, context) {
  try {
    const client = await pool.connect();
    const result = await client.query('select id, name from note.topics');
    client.release();
    return Promise.resolve(result.rows);
  } catch (e) { return Promise.reject(e); }
}

async function getCategories(parent, args, context) {
  try {
    const client = await pool.connect();
    const result = await client.query('select id, name from note.categories');
    client.release();
    return Promise.resolve(result.rows);
  } catch (e) { return Promise.reject(e); }
}

async function getTagsForCategory(category, args, context) {
  try {
    const client = await pool.connect();
    const result = await client.query('select id, name, category_id from note.tags where category_id = $1', [category.id]);
    client.release();
    return Promise.resolve(result.rows);
  } catch (e) { return Promise.reject(e); }
}

async function getCategoryFromTag(tag, args, context) {
  try {
    const client = await pool.connect();
    const result = await client.query('select id, name from note.categories where id = $1',
      [tag.category_id]);
    client.release();
    return Promise.resolve(result.rows[0]);
  } catch (e) { return Promise.reject(e); }
}

async function getSubscriptionsFromTag(tag, args, context) {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`
    select array_to_json(array_agg(row_to_json(p))) results
    from (
      SELECT user_preferences.id, user_preferences.location_x, user_preferences.location_y,
      (
        select array_to_json(array_agg(row_to_json(s))) 
        from (
          select send_types.id, send_types.type, send_types.email, 
            send_types.phone
          from note.send_types
          WHERE user_preferences.id = send_types.user_id
        ) as s
      ) as send_types
      FROM note.tags
      INNER JOIN note.subscriptions
        ON subscriptions.tag_id = tags.id
      INNER JOIN note.user_preferences
        ON user_preferences.id = subscriptions.user_id  
      WHERE tags.id = $1
    ) as p`, [tag.id]);
    client.release();
    const ret = rows[0].results;
    return Promise.resolve(ret);
  } catch (e) { return Promise.reject(e); }
}

async function getTopicsFromTag(tag, args, context) {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`  
    select array_to_json(array_agg(row_to_json(tp))) results
      from (
        select topics.id, topics.name,
        (
          select array_to_json(array_agg(row_to_json(m))) 
          from (
            select message, sent, datesent 
            from note.messages
            WHERE topics.id = topic_id
          ) as m
        ) as messages
        from note.topics
        INNER JOIN note.topic_tags
        ON topics.id = topic_tags.topic_id
        INNER JOIN note.tags
        ON tags.id = topic_tags.tag_id
        where tags.id = $1  
    ) as tp 
    `, [tag.id]);
    client.release();
    const ret = rows[0].results;
    return Promise.resolve(ret);
  } catch (e) { return Promise.reject(e); }
}

async function createTopic(obj, args, context) {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`  
    insert into note.topics(name)VALUES($1) returning id, name;
    `, [args.name]);
    client.release();
    const ret = rows[0];
    return Promise.resolve(ret);
  } catch (e) { return Promise.reject(e); }
}

async function deleteTopic(obj, args, context) {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`  
    delete from note.topics where id = $1 returning id, name;
    `, [args.id]);
    client.release();
    const ret = rows[0];
    return Promise.resolve(ret);
  } catch (e) { return Promise.reject(e); }
}

async function createTag(obj, args, context) {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`  
    insert into note.tags(name, category_id)VALUES($1, $2) returning id, name, category_id;
    `, [args.tag.name, args.tag.category]);
    client.release();
    const ret = rows[0];
    return Promise.resolve(ret);
  } catch (e) { return Promise.reject(e); }
}

async function deleteTag(obj, args, context) {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`  
    delete from note.tags where id = $1 returning id, name, category_id;
    `, [args.id]);
    client.release();
    const ret = rows[0];
    return Promise.resolve(ret);
  } catch (e) { return Promise.reject(e); }
}

async function createUserPreference(obj, args, context) {
  try {
    const client = await pool.connect();
    //delete out any existing records for this email
    for(send_type of args.user_preference.send_types){
      const { rows } = await client.query(`  
      delete from note.send_types where email = $1 returning user_id;
      `, [send_type.email]);
      if (rows[0]){
        const ret = rows[0];
        await client.query(`  
        delete from note.subscriptions where user_id = $1;
        `, [ret.user_id]);
        await client.query(`  
        delete from note.user_preferences where id = $1;
        `, [ret.user_id]);
      }
    }
    //insert
    const { rows } = await client.query(`  
    insert into note.user_preferences(location_x, location_y)VALUES($1, $2) returning id, location_x, location_y;
    `, [ args.user_preference.location_x, args.user_preference.location_y ]);
    const user_id = rows[0].id;
    const user_location_x = rows[0].location_x;
    const user_location_y = rows[0].location_y;
    for(send_type of args.user_preference.send_types){
      const { rows } = await client.query(`  
      insert into note.send_types(
          user_id, type, email, phone)
        VALUES($1, $2, $3, $4)
      `, [ user_id, send_type.type, send_type.email, 
      send_type.phone ]);
    }
    for(subscription of args.user_preference.subscriptions){
      const { rows } = await client.query(`  
      insert into note.subscriptions(
          user_id, tag_id, radius_miles, whole_city)
        VALUES($1, $2, $3, $4)
      `, [ user_id, subscription.tag_id, subscription.radius_miles, subscription.whole_city ]);
    }
    client.release();
    const ret = Object.assign({},args.user_preference,{id: user_id, location_x: user_location_x, location_y: user_location_y})
    return Promise.resolve(ret);
  } catch (e) { return Promise.reject(e); }
}

async function updateUserPreference(obj, args, context) {
  try {
    const emailsendtype = args.user_preference.send_types.find(function(sendtype) {
      return sendtype.type = 'EMAIL';
    }); 

    //Get the user_id
    const client = await pool.connect();
    const { rows } = await client.query(`  
    select send_types.user_id from note.send_types where email = $1;
    `, [ emailsendtype.email ]);
    const user_id = rows[0].user_id;

    //update user
    await client.query(`
    update note.user_preferences set location_x = $2, location_y = $3 where id = $1;
    `, [ user_id, args.user_preference.location_x, args.user_preference.location_y]);

    //update or insert send_types (TODO: is delete needed?)
    for(send_type of args.user_preference.send_types){
      await client.query(` 
      insert into note.send_types(
        user_id, type, email, phone)
      VALUES($1, $2, $3, $4)
      on conflict (user_id, type) do
      update set email = $3, phone = $4
      where send_types.user_id = $1 and send_types.type = $2;
      `, [ user_id, send_type.type, send_type.email, send_type.phone ]);
    }

    // delete subscriptions not in array
    const keepTags = args.user_preference.subscriptions.map(scrip=>parseInt(scrip.tag.id));
    const res = await client.query(`
    select * from note.subscriptions
    where subscriptions.user_id = $1;
    `, [ user_id ]);
    for ( row of res.rows) {
      if (keepTags.indexOf(row.tag_id) === -1) {
        await client.query(`
        delete from note.subscriptions
        where subscriptions.user_id = $1
        and subscriptions.tag_id = $2;
        `, [ user_id, row.tag_id ])
      }
    };

    // insert or update subscriptions
    for(subscription of args.user_preference.subscriptions){
      await client.query(`
      insert into note.subscriptions(
        user_id, tag_id, radius_miles, whole_city)
      VALUES($1, $2, $3, $4)
      on conflict (user_id, tag_id) do
      update set radius_miles = $3, whole_city = $4
      where subscriptions.user_id = $1 and subscriptions.tag_id = $2
      `, [ user_id, subscription.tag.id, subscription.radius_miles, subscription.whole_city ]);
    }
////////////////////////////////////////////////////////

    client.release();
    const ret = Object.assign({},
      { id: user_id, 
        location_x: args.user_preference.location_x, 
        location_y: args.user_preference.location_y,
        subscriptions: args.user_preference.subscriptions,
        send_types: args.user_preference.send_types    
      }); console.log(ret);console.log(ret.subscriptions);
    return Promise.resolve(ret);
  } catch (e) { return Promise.reject(e); }

}

async function deleteUserPreference(obj, args, context) {
  let ret;
  try {
    const client = await pool.connect();
    const result = await client.query(`  
      select send_types.user_id from note.send_types where email = $1;
    `, [args.email]);
    if(result.rowCount > 0){
      const user_id = result.rows[0].user_id;
      await client.query(`  
        delete from note.subscriptions where user_id = $1;
      `, [user_id]);
      await client.query(`  
        delete from note.send_types where user_id = $1;
      `, [user_id]);
      const { rows } = await client.query(`  
        delete from note.user_preferences where id = $1 returning id;
      `, [user_id]);
      ret = rows[0].id;
    }
    client.release();
    
    return Promise.resolve(ret);
  } catch (e) { return Promise.reject(e); }
}

async function deleteUserPreferenceSecure(obj, args, context) {
  let ret;
  const urlObj = new URL(args.url);
  try {
    const decodedEmail = urlObj.searchParams.get('e');
    const encodedEmail = encodeURIComponent(decodedEmail);
    const urlHash = urlObj.searchParams.get('h');
    const urlExpireEpoch = urlObj.searchParams.get('x');
    const hashShouldBe = cryptofuncs.getHash(encodedEmail,urlExpireEpoch)
    if (urlExpireEpoch > Date.now()) { //not expired
      if(hashShouldBe === urlHash){    //hash matches
        const client = await pool.connect();
        const result = await client.query(`  
          select send_types.user_id from note.send_types where email = $1;
        `, [ decodedEmail ]);
        if(result.rowCount > 0){
          const user_id = result.rows[0].user_id;
          await client.query(`  
            delete from note.subscriptions where user_id = $1;
          `, [user_id]);
          await client.query(`  
            delete from note.send_types where user_id = $1;
          `, [user_id]);
          const { rows } = await client.query(`  
            delete from note.user_preferences where id = $1 returning id;
          `, [user_id]);
          ret = rows[0].id;
        }
        client.release();
        
        return Promise.resolve(ret);
      }
    }
  } catch (e) { return Promise.reject(e); }
}

const resolvers = {
  Query: {
    message: getMessage,
    category: getCategory,
    user_preference: getUserPreference,
    tag: getTag,
    tags: getTags,
    topics: getTopics,
    categories: getCategories,
  },
  Category: {
    tags: getTagsForCategory,
  },
  Tag: {
    category: getCategoryFromTag,
    subscriptions: getSubscriptionsFromTag,
    topics: getTopicsFromTag,
  },
  Mutation: {
    createTopic,
    deleteTopic,
    createTag,
    deleteTag,
    createUserPreference,
    updateUserPreference,
    deleteUserPreference,
    deleteUserPreferenceSecure,
  },
};

module.exports = resolvers;
