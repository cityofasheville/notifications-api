GRANT CONNECT ON DATABASE mdastore1 TO simplicity_reader;

GRANT USAGE ON SCHEMA simplicity TO simplicity_reader;

GRANT SELECT ON ALL TABLES IN SCHEMA simplicity TO simplicity_reader;

ALTER DEFAULT PRIVILEGES IN SCHEMA simplicity
GRANT SELECT ON TABLES TO simplicity_reader;