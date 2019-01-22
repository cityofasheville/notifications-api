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