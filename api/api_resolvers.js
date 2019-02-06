/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

const getDbConnection = require('../common/db');

const pool = getDbConnection('mds'); // Initialize the connection.

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

// gets a person and the tags they are subscribed to.
async function getPerson(parent, args, context) {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`
    select row_to_json(peep) results
    from (
      select people.email, people.phone, 
      people.email_verified, people.phone_verified,
      people.send_email, people.send_text, people.send_push, people.send_voice,
      (
        select array_to_json(array_agg(row_to_json(t))) 
        from (
          select tags.id, tags.category_id, tags.name
          from note.subscriptions
          INNER JOIN note.tags
          ON subscriptions.tag_id = tags.id
          WHERE people.id = subscriptions.user_id
        ) as t
      ) as tags
      from note.people
      where people.id = $1
    ) as peep`, [args.id]);
    client.release();
    const ret = rows[0].results;
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

async function getPeopleFromTag(tag, args, context) {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`
    select array_to_json(array_agg(row_to_json(p))) results
    from (
      SELECT people.id, email, phone, send_email, send_text, send_push, send_voice
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
    `, [args.name, args.category]);
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

const resolvers = {
  Query: {
    message: getMessage,
    category: getCategory,
    person: getPerson,
    tag: getTag,
    tags: getTags,
    topics: getTopics,
  },
  Category: {
    tags: getTagsForCategory,
  },
  Tag: {
    category: getCategoryFromTag,
    people: getPeopleFromTag,
    topics: getTopicsFromTag,
  },
  Mutation: {
    createTopic,
    deleteTopic,
    createTag,
    deleteTag,
  },
};

module.exports = resolvers;
