import pgpkg from 'pg';
const { defaults, Pool } = pgpkg;
import mssqlpkg from 'mssql';
const { ConnectionPool } = mssqlpkg;
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
  if (cfg.db_type === 'mssql') {
    const pool = new ConnectionPool(cfg);
    pool.on('error', (err) => {
      throw new Error(`Error on database connection pool: ${err}`);
    });

    pool.connect((err) => {
      if (err) {
        throw new Error(`Error trying to create a connection pool ${err}`);
      }
    });
    return pool;
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
