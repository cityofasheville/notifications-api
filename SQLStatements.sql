/*
SELECT id, name	FROM note.tags;
SELECT id, name	FROM note.topics;
SELECT * FROM note.topic_tags;

SELECT id, topic_id, message, sent, datesent FROM note.messages;

SELECT * FROM note.people;
SELECT * FROM note.subscriptions;

SELECT people.*, tags.id AS tags_id, topics.name, messages.* 
FROM note.people
INNER JOIN note.subscriptions
	ON people.id = subscriptions.user_id	
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
INSERT INTO note.tags(name,category_id)VALUES('28801',1),('28803',1),('Affordable',1);
INSERT INTO note.topics(name)VALUES('Montford Gardens'),('West Estates');
INSERT INTO note.topic_tags(topic_id,tag_id)VALUES(1,1),(1,3),(2,2);

INSERT INTO note.people(emailaddress,send_email)VALUES('jtwilson@ashevillenc.gov',true);
INSERT INTO note.subscriptions(user_id,tag_id)VALUES(1,1);
INSERT INTO note.messages(topic_id, message, sent)VALUES(1, 'Montford Gardens Apartments coming soon',false);
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
 -- DROP TABLE note.people CASCADE;

CREATE TABLE note.people
(
    id SERIAL,
    emailaddress character varying COLLATE pg_catalog."default",
    phonenumber character varying COLLATE pg_catalog."default",
    send_email boolean,
    send_text boolean,
    send_push boolean,
    send_voice boolean,
    CONSTRAINT people_pkey PRIMARY KEY (id)
);
---------------------------------------------------------------------------------
-- DROP TABLE note.subscriptions CASCADE;

CREATE TABLE note.subscriptions
(
    id SERIAL,
    user_id integer NOT NULL REFERENCES note.people(id),
    tag_id integer,
    CONSTRAINT subscriptions_pkey PRIMARY KEY (id)
);



