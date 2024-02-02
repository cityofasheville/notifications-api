
import "dotenv/config.js";

const defaultConfigs = {
  note: {
    db_type: 'pg',
    host: process.env.note_host,
    user: process.env.note_user,
    password: process.env.note_password,
    database: process.env.note_database,
    port: 5432,
    ssl: false,
  },
  mds: {
    db_type: 'pg',
    host: process.env.mds_host,
    user: process.env.mds_user,
    password: process.env.mds_password,
    database: process.env.mds_database,
    port: 5432,
    ssl: false,
  },
};


export default  defaultConfigs;
