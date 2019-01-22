SELECT id, name	FROM public.tags;
SELECT id, name	FROM public.topics;
SELECT * FROM public.topic_tags;

SELECT id, topic_id, message, sent, datesent FROM public.messages;

SELECT * FROM public.users;
SELECT * FROM public.user_subscriptions;