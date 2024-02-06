const pg = require('pg');
const dbConfigurations = require('./db_configs');

const dbConnections = {};

pg.defaults.poolSize = 1;
const PgPool = pg.Pool;

const dbPool = (name) => {
  if (dbConfigurations[name] === undefined) {
    throw new Error(`Unknown database configuration ${name}`);
  }
  const cfg = dbConfigurations[name];
  if (cfg.db_type === 'pg') {
    return new PgPool(cfg);
  }
  throw new Error(`Unknown database type ${cfg.db_type}`);
};

const getDbConnection = (name) => {
  if (dbConnections[name] === undefined) {
    dbConnections[name] = dbPool(name);
  }
  return dbConnections[name];
};

module.exports = getDbConnection;
