/*
SELECT * FROM note.categories;
SELECT * FROM note.tags;
SELECT * FROM note.topics;
SELECT * FROM note.topic_tags;

SELECT id, topic_id, message, sent, datesent FROM note.messages;

SELECT * FROM note.user_preferences;
SELECT * FROM note.send_types;

SELECT * FROM note.subscriptions;

SELECT user_preferences.*, send_types.type, email, tags.id AS tags_id, topics.name, messages.* 
FROM note.user_preferences
INNER JOIN note.send_types
  ON user_preferences.id = send_types.user_id
INNER JOIN note.subscriptions
  ON user_preferences.id = subscriptions.user_id  
INNER JOIN note.tags
  ON subscriptions.tag_id = tags.id
INNER JOIN note.topic_tags
  ON tags.id = topic_tags.tag_id
INNER JOIN note.topics
  ON topic_tags.topic_id = topics.id
INNER JOIN note.messages
  ON topics.id = messages.topic_id
AND topics.id = 1
---------
SELECT * FROM note.messages
INNER JOIN note.topics
ON messages.topic_id = topics.id
INNER JOIN note.topic_tags
ON topics.id = topic_tags.topic_id
INNER JOIN note.tags
ON tags.id = topic_tags.tag_id
---------
INSERT INTO note.categories(name)VALUES('Development');
INSERT INTO note.tags(name,category_id)VALUES('Minor',1),('Major',1),('Affordable',1),('Slope',1);
INSERT INTO note.topics(name,permit_num,location_x,location_y)VALUES('Basilica','19-01612',-82.5557605,35.5962723);
INSERT INTO note.topics(name,permit_num,location_x,location_y)VALUES('West Estates','x0213-jjj',-82.5550000,35.5960000);
INSERT INTO note.topic_tags(topic_id,tag_id)VALUES(1,1),(2,1),(1,3);

INSERT INTO note.user_preferences(location_x,location_y)VALUES(-82.5510697,35.5955683);
INSERT INTO note.send_types(user_id,type,email,phone)VALUES(1,'EMAIL','jtwilson@ashevillenc.gov',null);
INSERT INTO note.subscriptions(user_id,tag_id,radius_miles,whole_city)VALUES(1,1,0.5,false),(1,2,null,true);
INSERT INTO note.messages(topic_id, message, sent)VALUES(1, 'Paint door black',false);
INSERT INTO note.messages(topic_id, message, sent)VALUES(2, 'West Estates Luxury Condos replacing Pub',false);
*/    
-------------------------------------
-- CREATE DB 

-- DROP TABLE note.categories CASCADE;

CREATE TABLE note.categories
(
    id SERIAL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT categories_pkey PRIMARY KEY (id)
);

---------------------------------------------------------------------------------
-- DROP TABLE note.tags CASCADE;

CREATE TABLE note.tags
(
    id SERIAL,
    category_id integer NOT NULL REFERENCES note.categories(id),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tags_pkey PRIMARY KEY (id)
);
---------------------------------------------------------------------------------
-- DROP TABLE note.topics CASCADE;

CREATE TABLE note.topics
(
    id SERIAL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    permit_num character varying (30) COLLATE pg_catalog."default",
    location_x float,
    location_y float,
    CONSTRAINT topics_pkey PRIMARY KEY (id)
);
---------------------------------------------------------------------------------
 -- DROP TABLE note.topic_tags CASCADE;

CREATE TABLE note.topic_tags
(
    id SERIAL,
    tag_id integer NOT NULL REFERENCES note.tags(id),
    topic_id integer NOT NULL REFERENCES note.topics(id),
    CONSTRAINT topic_tags_pkey PRIMARY KEY (id)
);---------------------------------------------------------------------------------
-- DROP TABLE note.messages CASCADE;

CREATE TABLE note.messages
(
    id SERIAL,
    topic_id integer NOT NULL REFERENCES note.topics(id),
    message character varying COLLATE pg_catalog."default",
    sent boolean,
    datesent date,
    CONSTRAINT messages_pkey PRIMARY KEY (id)
);
---------------------------------------------------------------------------------
-- DROP TABLE note.user_preferences CASCADE;

CREATE TABLE note.user_preferences
(
    id SERIAL,
    location_x float,
    location_y float,
    CONSTRAINT user_preferences_pkey PRIMARY KEY (id)
);

---------------------------------------------------------------------------------
-- DROP TABLE note.send_types CASCADE;

CREATE TABLE note.send_types
(
    id SERIAL,
    user_id integer NOT NULL REFERENCES note.user_preferences(id),
    type character varying (10) COLLATE pg_catalog."default", --EMAIL TEXT PUSH VOICE
    email character varying COLLATE pg_catalog."default",
    phone character varying COLLATE pg_catalog."default",
    CONSTRAINT send_types_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX send_types_user_id_type ON note.send_types USING btree (user_id, type);

---------------------------------------------------------------------------------
-- DROP TABLE note.subscriptions CASCADE;

CREATE TABLE note.subscriptions
(
    id SERIAL,
    user_id integer NOT NULL REFERENCES note.user_preferences(id),
    tag_id integer NOT NULL REFERENCES note.tags(id),
    radius_miles float,
    whole_city boolean,
    CONSTRAINT subscriptions_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX subscriptions_user_id_tag_id ON note.subscriptions USING btree (user_id, tag_id);

---------------------------------------------------------------------------------
-- DROP TABLE note.project_types CASCADE;

CREATE TABLE note.project_types
(
    tag_level character varying (30) COLLATE pg_catalog."default" NOT NULL,
    project_type character varying (30) COLLATE pg_catalog."default" NOT NULL,
    permit_group character varying (30) COLLATE pg_catalog."default" NOT NULL,
    permit_type character varying (30) COLLATE pg_catalog."default" NOT NULL,
    permit_subtype character varying (30) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT project_types_pkey PRIMARY KEY (project_type)
);

INSERT INTO note.project_types(tag_level,project_type,permit_group,permit_type,permit_subtype)VALUES
('Minor','Level I','Planning','Development','Level I'),
('Major','Major Subdivision','Planning','Subdivision','Major'),
('Major','Level II','Planning','Development','Level II'),
('Major','Level III','Planning','Development','Level III'),
('Major','Conditional Zoning','Planning','Development','Conditional Zoning'),
('Major','Conditional Use Permit','Planning','Development','Conditional Use');

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