import "dotenv/config.js";
import pgResolvers from './api_resolvers_pg.js';
import sqliteResolvers from './api_resolvers_sqlite.js';

const databaseType = process.env.database_type || 'pg';

let resolvers;
if (databaseType === 'pg') {
  resolvers = pgResolvers;
} else if (databaseType === 'memory') {
  resolvers = sqliteResolvers;
} else {
  throw new Error(`Unknown database type ${databaseType}`);
}
export default resolvers;