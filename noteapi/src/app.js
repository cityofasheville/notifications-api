import typeDefs from './schema.js';
import resolvers from './resolvers.js';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http'; // used by drain plugin

import express from 'express';
import session from 'express-session';
import cors from 'cors';
import cache_client from './util/cache_client.js';
import { checkLogin, initializeContext, getUserInfo } from './util/coa-web-login/index.js';
import memorystore from 'memorystore';
const MemoryStore = memorystore(session);
import connectpgsimple from 'connect-pg-simple';
const PgSession = connectpgsimple(session);

import "dotenv/config.js";
import { apiConfig } from './api/config.js';
import getDbConnection from './util/db.js';

const GRAPHQL_PORT = process.env.port || 4000;

// PLAYGROUND
let debug = false;
if(process.env.debug === 'true') {
  debug = true;
}

(async () => {
  const app = express();

  let sessionCache = null;
  const prunePeriod = 86400000; // prune expired entries every 24h
  const sessionCacheMethod = process.env.cache_method || 'pg';
  if (sessionCacheMethod === 'memory') {
    sessionCache = new MemoryStore({
      checkPeriod: prunePeriod,
    });
  } else if (sessionCacheMethod === 'pg') {
    sessionCache = new PgSession({
      pool: getDbConnection('note'),
      schemaName: 'aux',
      ttl: prunePeriod,
    });
  } else {
    throw new Error(`Unknown caching method ${sessionCacheMethod}`);
  }

  // Initialize session management
  app.use(session({
    name: process.env.sessionName,
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: sessionCache,
    cookie: {
      httpOnly: true,
      secure: 'auto',
      maxAge: 1000 * 60 * 60 * 24 * process.env.maxSessionDays,
    },
  }));

  // Set up CORS
  const allowedOrigins = [
    'https://dev-notifications-frontend.ashevillenc.gov', // dev frontend
    'https://notifications.ashevillenc.gov',              // prod frontend
    'http://localhost:3000',                               // local frontend
    'https://dev-notify.ashevillenc.gov',                 // dev sandbox
    'https://notify-api.ashevillenc.gov',                 // prod sandbox
    'http://localhost:4000',                               // local sandbox
    'http://localhost:4001',                               // local sandbox
  ];

  const corsOptions = {
    origin: function (origin, callback) {
      // console.log("orig", origin);
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`))
      }
    },
    credentials: true,
  };

  // // Check whether the user is logged in
  app.use((req, res, next) => {
    const sessionId = req.session.id;
    cache_client.get(sessionId)
      .then((cData) => {
        // console.log(sessionId, cData);
        let ensureInCache = Promise.resolve(null);
        const cachedContext = cData || initializeContext();
        if (!cData) {
          ensureInCache = cache_client.store(sessionId, cachedContext);
        }
        ensureInCache.then(() => {
          checkLogin(sessionId, cachedContext, cache_client)
            .then(() => getUserInfo(sessionId, cachedContext, apiConfig, cache_client, getDbConnection('note')))
            .then((uinfo) => {
              req.session.employee_id = uinfo.id;
              return next();
            })
            .catch((err) => {
              const error = new Error(err.toString().substring(6));
              error.httpStatusCode = 403;
              error.stack = null;
              return next(error); 
            });
        });
      });
  });

  const httpServer = createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: debug,
    playground: debug,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  app.use(
    '/graphql',
    cors(corsOptions),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        token: req.headers.token,
        sessionId: req.session.id,
        session: req.session,
        cache: cache_client,
        debug,
      }),
    }),
  );

  await new Promise((resolve) => httpServer.listen({ port: GRAPHQL_PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${GRAPHQL_PORT}/graphql`);
})();
