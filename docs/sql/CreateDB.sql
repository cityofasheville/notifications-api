------------------------
CREATE TABLE note.categories (
	id serial4 NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT categories_pkey PRIMARY KEY (id)
);

------------------------
CREATE TABLE note.notification_permits (
	permit_num varchar(30) NOT NULL,
	applied_date timestamp NULL,
	"name" varchar NULL,
	x numeric(38, 8) NULL,
	y numeric(38, 8) NULL,
	tags jsonb NULL,
	CONSTRAINT permit_num_pkey PRIMARY KEY (permit_num)
);

------------------------
CREATE TABLE note.notification_permits_history (
	permit_num varchar(30) NOT NULL,
	applied_date timestamp NULL,
	"name" varchar NULL,
	sent_date timestamp NULL,
	CONSTRAINT notification_permits_history_pk PRIMARY KEY (permit_num)
);

------------------------
CREATE TABLE note.user_preferences (
	id serial4 NOT NULL,
	location_x float8 NULL,
	location_y float8 NULL,
	CONSTRAINT user_preferences_pkey PRIMARY KEY (id)
);

------------------------
CREATE TABLE note.send_types (
	id serial4 NOT NULL,
	user_id int4 NOT NULL,
	"type" varchar(10) NULL,
	email varchar NULL,
	phone varchar NULL,
	CONSTRAINT send_types_pkey PRIMARY KEY (id),
	CONSTRAINT send_types_user_id_fkey FOREIGN KEY (user_id) REFERENCES note.user_preferences(id)
);
CREATE UNIQUE INDEX send_types_user_id_type ON note.send_types USING btree (user_id, type);

------------------------
CREATE TABLE note.tags (
	id serial4 NOT NULL,
	category_id int4 NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT tags_pkey PRIMARY KEY (id),
	CONSTRAINT tags_category_id_fkey FOREIGN KEY (category_id) REFERENCES note.categories(id)
);

------------------------
CREATE TABLE note.subscriptions (
	id serial4 NOT NULL,
	user_id int4 NOT NULL,
	tag_id int4 NOT NULL,
	radius_miles float8 NULL,
	whole_city bool NULL,
	CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
	CONSTRAINT subscriptions_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES note.tags(id),
	CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES note.user_preferences(id)
);
CREATE UNIQUE INDEX subscriptions_user_id_tag_id ON note.subscriptions USING btree (user_id, tag_id);

-----------------------
--ACCESS DB
REVOKE CONNECT ON DATABASE notifications FROM PUBLIC;
GRANT  CONNECT ON DATABASE notifications  TO notedb;
--ACCESS SCHEMA
REVOKE ALL     ON SCHEMA note FROM PUBLIC;
GRANT  USAGE   ON SCHEMA note  TO notedb;
--ACCESS TABLES
REVOKE ALL ON ALL TABLES IN SCHEMA note FROM PUBLIC ;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO notedb ;
grant SELECT, INSERT, UPDATE, DELETE on all tables in schema note to notedb;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA note TO notedb;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA note TO notedb;
