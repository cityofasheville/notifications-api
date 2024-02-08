import { defaults, Pool } from 'pg';
import dbConfigurations from './db_configs';

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
  return dbConnections[name];
};

export default getDbConnection;
