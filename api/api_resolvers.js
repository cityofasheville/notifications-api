/* eslint-disable no-console no-unused-vars */

const getDbConnection = require('../common/db');

const pool = getDbConnection('mds'); // Initialize the connection.

async function getMessage(parent, args, context) { // gets a message, its topic, and lists tags
  try {
    const client = await pool.connect();
    const result = await client.query(`
    SELECT messages.message, messages.sent, messages.datesent, topics.name AS topicname, tags.name as tagname 
    FROM note.messages
    INNER JOIN note.topics
    ON messages.topic_id = topics.id
    INNER JOIN note.topic_tags
    ON topics.id = topic_tags.topic_id
    INNER JOIN note.tags
    ON tags.id = topic_tags.tag_id
    WHERE messages.id = $1`, [args.id]);
    client.release();
    const tags = result.rows.map(row => ({ name: row.tagname }));
    const data1 = result.rows[0];
    const msgobj = {
      msg: data1.message,
      sent: data1.sent,
      datesent: data1.datesent,
      topic: {
        name: data1.topicname,
        tags: tags
      }
      
    }
    console.log(msgobj);

    return Promise.resolve(msgobj);
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
    //console.log(result.rows);
    return Promise.resolve(result.rows);
    
  } catch (e) { return Promise.reject(e); }
}

async function getTopics(parent, args, context) {
  try {
    const client = await pool.connect();
    const result = await client.query('select id, name, category_id from note.topics');
    client.release();
    return Promise.resolve(result.rows);
  } catch (e) { return Promise.reject(e); }
}

function test2(obj, args, context) {
  return { message: 'You have successfully called the test2 mutation' };
}

async function getTagsForCategory(category, args, context) {
  try {
    const client = await pool.connect();
    const result = await client.query('select id, name from note.tags where category_id = $1', [category.id]);
    client.release();
    //console.log(result.rows);
    return Promise.resolve(result.rows);
    
  } catch (e) { return Promise.reject(e); }
}

// async function getTopicsFromTag(tag, args, context) {
//   try {
//     const client = await pool.connect();
//     const result = await client.query('select id, name from note.topics where category_id = $1', [tag.id]);
//     client.release();
//     //console.log(result.rows);
//     return Promise.resolve(result.rows);
    
//   } catch (e) { return Promise.reject(e); }
// }

async function getCategoryFromTag(tag, args, context) {
  try {
    const client = await pool.connect();
    const result = await client.query('select id, name from note.categories where id = $1', [tag.category_id]);
    client.release();
    //console.log(result.rows);
    return Promise.resolve(result.rows);
    
  } catch (e) { return Promise.reject(e); }
}

// async function getPeopleFromTag(tag, args, context) { THIS WILL RETURN A TREE
//   try {
//     const client = await pool.connect();
//     const result = await client.query('select id, name from note.subscriptions where category_id = $1', [category.id]);
//     client.release();
//     //console.log(result.rows);
//     return Promise.resolve(result.rows);
    
//   } catch (e) { return Promise.reject(e); }
// }

const resolvers = {
  Query: {
    message: getMessage,
    category: getCategory,
    tag: getTag,
    tags: getTags,
    topics: getTopics,
  },
  Category: {
    tags: getTagsForCategory,
  },
  Tag: {
    category: getCategoryFromTag,
    // subscrs: getPeopleFromTag
  },
  Mutation: {
    test2,
  },
};

module.exports = resolvers;
