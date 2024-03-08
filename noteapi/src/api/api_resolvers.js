
import "dotenv/config.js";
// import pgResolvers from './api_resolvers_pg.js';
// import sqliteResolvers from './api_resolvers_sqlite.js';

const databaseType = process.env.database_type || 'pg';

let resolvers;
if (databaseType === 'pg') {
  import ('./api_resolvers_pg.js')
  .then((pgResolvers) => {
    resolvers = pgResolvers;
  });
} else if (databaseType === 'memory') {
  import ('./api_resolvers_sqlite.js')
  .then((sqliteResolvers) => {
    resolvers = sqliteResolvers;
  });
} else {
  throw new Error(`Unknown database type ${databaseType}`);
}

export default resolvers;