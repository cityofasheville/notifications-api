import "dotenv/config.js";
import sqliteResolvers from './api_resolvers_sqlite.js';

const databaseType = 'memory';

let resolvers;
if (databaseType === 'memory') {
  resolvers = sqliteResolvers;
} else {
  throw new Error(`Unknown database type ${databaseType}`);
}
export default resolvers;