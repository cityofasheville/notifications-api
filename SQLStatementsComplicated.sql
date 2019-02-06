/*
SELECT id, name	FROM note.tags;
SELECT id, name	FROM note.topics;
SELECT * FROM note.topic_tags;

SELECT id, topic_id, message, sent, datesent FROM note.messages;

SELECT * FROM note.users;
SELECT * FROM note.user_subscriptions;

SELECT users.*, tags.id AS tags_id, topics.name, messages.* 
FROM note.users
INNER JOIN note.user_subscriptions cat_sub
	ON users.id = cat_sub.user_id
INNER JOIN note.user_subscriptions tag_sub
	ON users.id = tag_sub.user_id	
INNER JOIN note.categories
	ON cat_sub.category_id = categories.id
INNER JOIN note.tags
	ON tag_sub.tag_id = tags.id
	AND categories.id = tags.category_id
INNER JOIN note.topic_tags
	ON tags.id = topic_tags.tag_id
INNER JOIN note.topics
	ON topic_tags.topic_id = topics.id
INNER JOIN note.messages
	ON topics.id = messages.topic_id
WHERE cat_sub.type = 'category'
AND   tag_sub.type = 'tag'
AND topics.id = 1

INSERT INTO note.categories(name)VALUES('Development');
INSERT INTO note.tags(name,category_id)VALUES('28801',1),('28803',1);
INSERT INTO note.topics(name,category_id)VALUES('Montford Gardens',1),('West Estates',1);
INSERT INTO note.topic_tags(topic_id,tag_id)VALUES(1,1),(2,2);

INSERT INTO note.users(emailaddress,send_email)VALUES('jtwilson@ashevillenc.gov',true);
INSERT INTO note.user_subscriptions(user_id,type,category_id)VALUES(1,'category',1);
INSERT INTO note.user_subscriptions(user_id,type,tag_id)VALUES(1,'tag',1);
INSERT INTO note.messages(topic_id, message, sent)VALUES(1, 'Montford Gardens Apartments coming soon',false);
INSERT INTO note.messages(topic_id, message, sent)VALUES(2, 'West Estates Luxury Condos replacing Pub',false);
*/
-------------------------------------
-- CREATE DB 

DROP TABLE note.categories CASCADE;

CREATE TABLE note.categories
(
    id SERIAL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT categories_pkey PRIMARY KEY (id)
);
---------------------------------------------------------------------------------
 DROP TABLE note.messages CASCADE;

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
 DROP TABLE note.tags CASCADE;

CREATE TABLE note.tags
(
    id SERIAL,
    category_id integer NOT NULL REFERENCES note.categories(id),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tags_pkey PRIMARY KEY (id)
);
---------------------------------------------------------------------------------
  DROP TABLE note.topic_tags CASCADE;

CREATE TABLE note.topic_tags
(
    id SERIAL,
    tag_id integer NOT NULL REFERENCES note.tags(id),
    topic_id integer NOT NULL REFERENCES note.topics(id),
    CONSTRAINT topic_tags_pkey PRIMARY KEY (id)
);
---------------------------------------------------------------------------------
 DROP TABLE note.topics CASCADE;

CREATE TABLE note.topics
(
    id SERIAL,
    category_id integer NOT NULL REFERENCES note.categories(id),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT topics_pkey PRIMARY KEY (id)
);
---------------------------------------------------------------------------------
 DROP TABLE note.user_subscriptions CASCADE;

CREATE TABLE note.user_subscriptions
(
    id SERIAL,
    user_id integer NOT NULL REFERENCES note.users(id),
    type character(10) COLLATE pg_catalog."default" NOT NULL,
    category_id integer,
    topic_id integer,
    tag_id integer,
    CONSTRAINT user_subscriptions_pkey PRIMARY KEY (id)
);
---------------------------------------------------------------------------------
 DROP TABLE note.users CASCADE;

CREATE TABLE note.users
(
    id SERIAL,
    emailaddress character varying COLLATE pg_catalog."default",
    phonenumber character varying COLLATE pg_catalog."default",
    send_email boolean,
    send_text boolean,
    send_push boolean,
    send_voice boolean,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);


