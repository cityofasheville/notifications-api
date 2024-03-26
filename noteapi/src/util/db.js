import pgpkg from 'pg';
const { defaults, Pool } = pgpkg;
import dbConfigurations from './db_configs.js';

const dbConnections = {};

defaults.poolSize = 1;
const PgPool = Pool;

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
  console.log('db connected', name);
  return dbConnections[name];
};

export default getDbConnection;
