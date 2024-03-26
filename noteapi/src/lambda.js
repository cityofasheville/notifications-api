import apiResolvers from './api/api_resolvers_pg.js';
import serverlessExpress from '@codegenie/serverless-express';
import connectpgsimple from 'connect-pg-simple';
import session from 'express-session';
const PgSession = connectpgsimple(session);

import server from './server.js';
import getDbConnection from './util/db.js';

const prunePeriod = 86400000; // prune expired entries every 24h

let sessionCache = new PgSession({
  pool: getDbConnection('note'),
  schemaName: 'aux',
  ttl: prunePeriod,
});

const app = await server(apiResolvers, sessionCache);
let serverlessExpressInstance = serverlessExpress({ app });

export async function handler(event, context) {
  return serverlessExpressInstance(event, context);
}
