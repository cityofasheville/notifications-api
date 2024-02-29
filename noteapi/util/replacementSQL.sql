    SELECT json_object(
        'id', user_preferences.id, 
        'location_x', user_preferences.location_x, 
        'location_y', user_preferences.location_y,
        'subscriptions', (
            SELECT json_group_array(json_object(
                'id', subscriptions.id, 
                'radius_miles', subscriptions.radius_miles, 
                'whole_city', subscriptions.whole_city, 
                'tag_id', subscriptions.tag_id,
                'tag', (
                    SELECT json_object(
                        'id', tags.id, 
                        'category_id', tags.category_id, 
                        'name', tags.name
                    ) as r1
                    FROM tags
                    WHERE subscriptions.tag_id = tags.id)
            )) as r2
            FROM subscriptions
            WHERE user_preferences.id = subscriptions.user_id
        ),
        'send_types', (
            SELECT json_group_array(json_object(
                'id', send_types.id, 
                'type', send_types.type, 
                'email', send_types.email, 
                'phone', send_types.phone
            )) as r3    
            FROM send_types
            WHERE send_types.user_id IS NOT NULL
            AND send_types.email = 'jtwilson@ashevillenc.gov'
            AND user_preferences.id = send_types.user_id
        )
    ) AS results
    FROM user_preferences