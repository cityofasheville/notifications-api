``` json
mutation CreateUserPreference($userPreference: UserPreferenceInput!) {
  createUserPreference(user_preference: $userPreference) {
    id
    location_x
    location_y
    send_types {
      email
    }
  }
}

{
  "user_preference": {
    "location_x": -82.543,
    "location_y": 35.345,
    "send_types": [
      {
        "type": "EMAIL",
        "email": "user@ashevillenc.gov"
      }
    ],
    "subscriptions": [
      {
        "radius_miles": 3,
        "whole_city": false,
        "tag": {
          "id": "2"
        }
      }
    ]
  }
}

query GetUserPreference {
  user_preference(email: "user@ashevillenc.gov") {
    id
    location_x
    location_y
    send_types {
      type
      email
    }
    subscriptions {
      radius_miles
      whole_city
      tag {
        id
      }

    }
  }
}

  mutation updateUserPreference(
    $user_preference: UserPreferenceInput!,
  ) {
    updateUserPreference(
      user_preference: $user_preference,
    ) {
      location_x
      location_y
      send_types {
        type
        email
      }
      subscriptions {
        tag {
          id
        }
        radius_miles
        whole_city
      }
    }
  }

{
  "user_preference": {
    "location_x": "-82.543",
    "location_y": "35.345",
    "send_types": [
      {
        "type": "EMAIL",
        "email": "user@ashevillenc.gov"
      }
    ],
    "subscriptions": [
      {
        "radius_miles": 3,
        "whole_city": false,
        "tag": {
          "id": "2"
        }
      }
    ]
  }
}
```
## This is what the front end actually sends.
``` json
query getUserPreference($email: String!) {
  user_preference(email: $email) {
    id
    location_x
    location_y
    send_types {
      type
      email
      __typename
    }
    subscriptions {
      id
      radius_miles
      whole_city
      tag {
        id
        name
        __typename
      }
      __typename
    }
    __typename
  }
}


{"email":"jtwilson@ashevillenc.gov"}
```