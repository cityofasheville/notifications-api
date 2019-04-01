-- testing results: of 29k records, 16k were selected and returned in 2.7 seconds


select user_preferences.id as user_preference, send_types.type, send_types.email, subscriptions.whole_city,
ST_Distance_Sphere(ST_MakePoint(user_preferences.location_x, user_preferences.location_y),ST_MakePoint(topics.location_x, topics.location_y)) / 1609.34 as distanceMiles,
subscriptions.radius_miles,
user_preferences.location_x, user_preferences.location_y,
topics.location_x, topics.location_y,
topics.name, topics.permit_num
--    select distinct send_types.type, send_types.email, send_types.phone, topics.name, topics.permit_num
from note.user_preferences
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
where ( 
    (subscriptions.whole_city = true) 
    or 
    (
     (ST_Distance_Sphere(ST_MakePoint(user_preferences.location_x, user_preferences.location_y),ST_MakePoint(topics.location_x, topics.location_y)) / 1609.34) 
     < subscriptions.radius_miles
    )
    )
    ORDER BY type, email, name;
