/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

const getDbConnection = require('../common/db');
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

// gets a person, their subscriptions, and their send types.
async function getPerson(parent, args, context) {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`
    select row_to_json(peep) results
    from (
      select people.id, people.location_x, people.location_y,
      (
        select array_to_json(array_agg(row_to_json(s))) 
        from (
          select subscriptions.id, subscriptions.radius_miles, subscriptions.whole_city,
          (
          	select array_to_json(array_agg(row_to_json(t)))
          	from (
          	
          		select tags.id tag_id, tags.category_id, tags.name
          		from note.tags
          		where subscriptions.tag_id = tags.id
          	) as t
          ) as tag
          from note.subscriptions
          WHERE people.id = subscriptions.user_id
        ) as s
      ) as subscriptions,
      (
        select array_to_json(array_agg(row_to_json(st))) 
        from (
          select send_types.id, send_types.type, send_types.email, 
            send_types.phone
          from note.send_types
          WHERE people.id = send_types.user_id
        ) as st
      ) as send_types      
      
      from note.people
      where people.id = $1
    ) as peep`, [args.id]);
    client.release();
    const ret = rows[0] ? rows[0].results : null;
    return Promise.resolve(ret);
  } catch (e) { return Promise.reject(e); }
}

// async function getPeople(parent, args, context) { 
//   try {
//     const client = await pool.connect();
//     const result = await client.query(`
//     select array_to_json(array_agg(row_to_json(p))) people
//     from (
//           select people.id, people.location_x, people.location_y,
//           (
//             select array_to_json(array_agg(row_to_json(t))) 
//             from (
//               select tags.id, tags.category_id, tags.name
//               from note.subscriptions
//               INNER JOIN note.tags
//               ON subscriptions.tag_id = tags.id
//               WHERE people.id = subscriptions.user_id
//             ) as t
//           ) as tags, 
//           (
//             select array_to_json(array_agg(row_to_json(s))) 
//             from (
//               select send_types.id, send_types.type, send_types.email, 
//                 send_types.phone
//               from note.send_types
//               WHERE people.id = send_types.user_id
//             ) as s
//           ) as send_types
//           from note.people
//     ) as p
//   `);
//     client.release();
//     return Promise.resolve(result.rows[0].people);
//   } catch (e) { return Promise.reject(e); }
// }

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
      SELECT people.id, people.location_x, people.location_y,
      (
        select array_to_json(array_agg(row_to_json(s))) 
        from (
          select send_types.id, send_types.type, send_types.email, 
		      	send_types.phone
          from note.send_types
          WHERE people.id = send_types.user_id
        ) as s
      ) as send_types
      FROM note.tags
      INNER JOIN note.subscriptions
        ON subscriptions.tag_id = tags.id
      INNER JOIN note.people
        ON people.id = subscriptions.user_id	
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
    insert into note.topics(name)VALUES($1) RETURNING id, name;
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
    delete from note.topics where id = $1 RETURNING id, name;
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
    insert into note.tags(name, category_id)VALUES($1, $2) RETURNING id, name, category_id;
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
    delete from note.tags where id = $1 RETURNING id, name, category_id;
    `, [args.id]);
    client.release();
    const ret = rows[0];
    return Promise.resolve(ret);
  } catch (e) { return Promise.reject(e); }
}

async function createPerson(obj, args, context) {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`  
    insert into note.people(location_x, location_y)VALUES($1, $2) RETURNING id, location_x, location_y;
    `, [ args.person.location_x, args.person.location_y ]);
    const user_id = rows[0].id;
    const user_location_x = rows[0].location_x;
    const user_location_y = rows[0].location_y;
    for(send_type of args.person.send_types){
      const { rows } = await client.query(`  
      insert into note.send_types(
          user_id, type, email, phone)
        VALUES($1, $2, $3, $4)
      `, [ user_id, send_type.type, send_type.email, 
      send_type.phone ]);
    }
    for(subscription of args.person.subscriptions){
      const { rows } = await client.query(`  
      insert into note.subscriptions(
          user_id, tag_id, radius_miles, whole_city)
        VALUES($1, $2, $3, $4)
      `, [ user_id, subscription.tag_id, subscription.radius_miles, subscription.whole_city ]);
    }
    client.release();
    const ret = Object.assign({},args.person,{id: user_id, location_x: user_location_x, location_y: user_location_y})
    return Promise.resolve(ret);
  } catch (e) { return Promise.reject(e); }
}

async function deletePerson(obj, args, context) {
  let ret;
  try {
    const client = await pool.connect();
    const result = await client.query(`  
      select id from note.people where id = $1;
    `, [args.id]);
    if(result.rowCount > 0){
      await client.query(`  
        delete from note.subscriptions where user_id = $1;
      `, [args.id]);
      await client.query(`  
        delete from note.send_types where user_id = $1;
      `, [args.id]);
      const { rows } = await client.query(`  
        delete from note.people where id = $1 RETURNING id;
      `, [args.id]);
      ret = rows[0].id;
    }
    client.release();
    
    return Promise.resolve(ret);
  } catch (e) { return Promise.reject(e); }
}

// async function getTagsForperson(obj, args, context) {
//   return [];
// }
// async function getSendTypesForperson(obj, args, context) {
//   return [];
// }

const resolvers = {
  Query: {
    message: getMessage,
    category: getCategory,
    person: getPerson,
    // people: getPeople,
    tag: getTag,
    tags: getTags,
    topics: getTopics,
    categories: getCategories,
  },
  Category: {
    tags: getTagsForCategory,
  },
  // person: {
  //   tags: getTagsForperson,
  //   send_types: getSendTypesForperson,
  // },
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
    createPerson,
    deletePerson,
  },
};

module.exports = resolvers;
