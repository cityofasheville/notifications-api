import typeDefs from './schema.js';
import getResolvers from './getResolvers.js';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http'; // used by drain plugin
import session from 'express-session';
import express from 'express';

import cors from 'cors';
import cache_client from './util/cache_client.js';
import { checkLogin, initializeContext, getUserInfo } from './util/coa-web-login/index.js';

import "dotenv/config.js";
import { apiConfig } from './api/config.js';
import getDbConnection from './util/db.js';
import corsOptions from './util/cors.js';

async function server(apiResolver, sessionCache) {

  const pool = getDbConnection('note'); // Initialize the connection.

  let resolvers = getResolvers(apiResolver);

  // PLAYGROUND
  let debug = false;
  if (process.env.debug === 'true') {
    debug = true;
  }

  const app = express();

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
            .then(() => getUserInfo(sessionId, cachedContext, apiConfig, cache_client, pool))
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

  app.use(cors(corsOptions));

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        pool,
        token: req.headers.token,
        sessionId: req.session.id,
        session: req.session,
        cache: cache_client,
        debug,
      }),
    }),
  );
  app.use('/', function (req, res, next) {
    res.redirect('graphql');
    return next();
  });
  return app;
}

export default server;