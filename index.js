const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');

const express = require('express');
const session = require('express-session');
const http = require('http');
const cors = require('cors');
const { json } = require('body-parser');
const cache = require('coa-web-cache');
const { checkLogin, initializeContext, getUserInfo } = require('coa-web-login');
const MemoryStore = require('memorystore')(session);
const PgSession = require('connect-pg-simple')(session);

require('dotenv').config();
const apiConfig = require('./api/config');
const getDbConnection = require('./common/db');

const GRAPHQL_PORT = process.env.PORT || 4000;

(async()=>{
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
      pool: getDbConnection('mds'),
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
    'https://dev-notifications-frontend.ashevillenc.gov/',
    'https://notifications.ashevillenc.gov/',
    'http://localhost:3000', // local test server
    'http://localhost:4000', // sandbox
  ];

  const corsOptions = {
    origin:  function (origin, callback) {
      // console.log("orig", origin);
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  };

  // // Check whether the user is logged in
  app.use((req, res, next) => {
    const sessionId = req.session.id;
    cache.get(sessionId)
      .then((cData) => {
        // console.log(sessionId, cData);
        let ensureInCache = Promise.resolve(null);
        const cachedContext = cData || initializeContext();
        if (!cData) {
          ensureInCache = cache.store(sessionId, cachedContext);
        }
        ensureInCache.then(() => {
          checkLogin(sessionId, cachedContext, cache)
            .then(() => getUserInfo(sessionId, cachedContext, apiConfig, cache, getDbConnection('mds')))
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

  // Add in any middleware defined by the API
  require('./api').middlewares.forEach((m) => { app.use(m); });

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  app.use(
    '/graphql',
    cors(corsOptions),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ 
        token: req.headers.token, 
        sessionId: req.session.id,
        session: req.session,
        cache,      
      }),
    }),
  );

  await new Promise((resolve) => httpServer.listen({ port: GRAPHQL_PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${GRAPHQL_PORT}/graphql`);
})();
