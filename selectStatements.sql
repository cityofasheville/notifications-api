SELECT id, name	FROM public.tags;
SELECT id, name	FROM public.topics;
SELECT * FROM public.topic_tags;

SELECT id, topic_id, message, sent, datesent FROM public.messages;

SELECT * FROM public.users;
SELECT * FROM public.user_subscriptions;

SELECT users.*, tags.id AS tags_id, topics.name FROM public.users
INNER JOIN public.user_subscriptions
ON users.id = user_subscriptions.user_id
INNER JOIN public.tags
ON user_subscriptions.tag_id = tags.id
INNER JOIN public.topic_tags
ON tags.id = topic_tags.tag_id
INNER JOIN public.topics
ON topic_tags.topic_id = topics.id
WHERE user_subscriptions.type ='tag'
AND topics.id = 1

-------------------------------------
-- CREATE DB 
 DROP TABLE note.messages;

CREATE TABLE note.messages
(
    id SERIAL,
    topic_id integer NOT NULL,
    message character varying COLLATE pg_catalog."default",
    sent boolean,
    datesent date,
    CONSTRAINT messages_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE note.messages
    OWNER to notedb;

 DROP TABLE note.tags;

CREATE TABLE note.tags
(
    id SERIAL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tags_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE note.tags
    OWNER to notedb;

  DROP TABLE note.topic_tags;

CREATE TABLE note.topic_tags
(
    id SERIAL,
    tag_id integer NOT NULL,
    topic_id integer NOT NULL,
    CONSTRAINT topic_tags_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE note.topic_tags
    OWNER to notedb;

 DROP TABLE note.topics;

CREATE TABLE note.topics
(
    id SERIAL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT topics_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE note.topics
    OWNER to notedb;

 DROP TABLE note.user_subscriptions;

CREATE TABLE note.user_subscriptions
(
    id SERIAL,
    user_id integer NOT NULL,
    type character(10) COLLATE pg_catalog."default" NOT NULL,
    topic_id integer,
    tag_id integer,
    CONSTRAINT user_subscriptions_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE note.user_subscriptions
    OWNER to notedb;

 DROP TABLE note.users;

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
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE note.users
    OWNER to notedb;



