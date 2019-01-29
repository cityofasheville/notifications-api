/* eslint-disable no-console */

const getDbConnection = require('../common/db');

const pool = getDbConnection('mds'); // Initialize the connection.

const tagsData = [{ id: '1', name: '28801', topics: [{ id: '10', name: 'MontfordGardens' }, { id: '20', name: 'MontfordEstates' }] }, { id: '2', name: '28803', topics: [{ id: '30', name: 'WestGardens' }] }];

function getTag(parent, args, context) { // eslint-disable-line no-unused-vars
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack);
    }
    client.query('select id, name, category_id from note.tags where id = 1', (err2, result) => {
      release();
      if (err2) {
        return console.error('Error executing query', err.stack);
      }
      console.log(result.rows);
      return result.rows;
    });
    return 0;
  });

}

function getTags(parent, args, context) { // eslint-disable-line no-unused-vars
  return tagsData;
}

function getTopic(parent, args, context) { // eslint-disable-line no-unused-vars
  return tagsData[0].topics;
}

function test2(obj, args, context) { // eslint-disable-line no-unused-vars
  return { message: 'You have successfully called the test2 mutation' };
}

const resolvers = {
  Query: {
    tag: getTag,
    tags: getTags,
    topics: getTopic,
  },
  Mutation: {
    test2,
  },
};


module.exports = resolvers;

/*
query {
  topics{
    name,
  },
  tags {
    name,
  },
  tag(id: "2"){
    name
  }
}

mutation {
  test2 {
    message
  }
}
*/
