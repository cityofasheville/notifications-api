const sql = require('mssql');
const pool = require('./db_configs');

const tagsData = [{ id: '1', name: '28801', topics: [{ id: '10', name: 'MontfordGardens'  }, { id: '20', name: 'MontfordEstates'  } ]  }, { id: '2', name: '28803', topics: [{ id: '30', name: 'WestGardens'  } ]  } ];

function getTag(parent, args, context) { // eslint-disable-line no-unused-vars
  pool.request()
    .input('id', sql.Int, 1)
    .query('select * from note.tags where id = @id')
    .then((res) => {
      console.log(res);
      return res;
    });
}

function getTags(parent, args, context) { // eslint-disable-line no-unused-vars
  return tagsData;
}

function getTopic(parent, args, context) { // eslint-disable-line no-unused-vars
  return tagsData[0].topics;
}

const resolvers = {
  Query: {
    tag: getTag,
    tags: getTags,
    topics: getTopic,
  },
  Category: {

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
*/
