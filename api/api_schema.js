const schema = `

type Message {
  id: ID!
  message: String!
  sent: Boolean
  datesent: String
  topic: Topic
}

type Topic {
  id: ID!
  name: String!
  tags: [Tag]
  messages: [Message]
}

type Tag {
  id: ID!
  name: String!
  topics: [Topic]
  category: Category!
  subscribers: [Subscriber]
}

type Category {
  id: ID!
  name: String!
  tags: [Tag]
}

type Subscr {
  subscriber: Subscriber!
  tag: Tag!
}

type Subscriber {
  id: ID!
  location_x: Float
  location_y: Float
  send_types: [SendType]
  tags: [Tag]
}

type SendType {
  id: ID!
  subscriber: Subscriber!
  type: SendEnum!
  email: String
  phone: String
}

extend type Query {
  message(id: ID!): Message
  category(id: ID!): Category
  subscriber(id: ID!): Subscriber
  subscribers: [Subscriber]
  tag(id: ID!): Tag
  tags: [Tag]
  topics: [Topic]
  categories: [Category]
}

extend type Mutation {
  createTopic(name: String!): Topic
  deleteTopic(id: ID!): Topic
  createTag(tag: TagInput!): Tag
  deleteTag(id: ID!): Tag
  createSubscriber(subscriber: SubscriberInput!): Subscriber
  deleteSubscriber(delids: DeleteSubscriberInput!): Int
}

input SubscriberInput {
  location_x: Float
  location_y: Float
  send_types: [SendTypeInput]
  tags: [TagIDInput]
}

input DeleteSubscriberInput {
  id: ID!
}

input SendTypeInput {
  type: SendEnum!
  email: String
  phone: String
}

input TagInput {
  name: String!
  category: ID!
}

input TagIDInput {
  id: ID!
}

enum SendEnum {
  EMAIL
  TEXT
  VOICE
  PUSH
}
`;
module.exports = schema;

/* deleteSubscriber(email: String, phone: String): Subscriber

let SubscriberInput = {
  "send_types": [
    {
      "send_type": "EMAIL",
      "email": "aoc@house.gov",
    }
  ],
  "tags": [
    {
      "tag_id": "2"
    }
  ]
}
*/