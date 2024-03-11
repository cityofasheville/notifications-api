// For local dev, we use in-memory db and session store. 
import apiResolvers from './api/api_resolvers_sqlite.js';
import memorystore from 'memorystore';
import session from 'express-session';
const MemoryStore = memorystore(session);

import server from './server.js';
import "dotenv/config.js";
const port = process.env.PORT || 3000;

const prunePeriod = 86400000; // prune expired entries every 24h

let sessionCache = new MemoryStore({
  checkPeriod: prunePeriod,
});

const app = await server(apiResolvers, sessionCache);

app.listen(port);
console.info(`listening on http://localhost:${port}/graphql`);
