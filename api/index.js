const schema = require('./api_schema');
const resolvers = require('./api_resolvers');
const middlewares = require('./api_middleware');

module.exports = {
  schema,
  resolvers,
  middlewares,
};
