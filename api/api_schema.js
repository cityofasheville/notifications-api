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
  subscriptions: [Subscription]
}

type Category {
  id: ID!
  name: String!
  tags: [Tag]
}

type Person {
  id: ID!
  location_x: Float
  location_y: Float
  send_types: [SendType]
  subscriptions: [Subscription]
}

type Subscription {
  id: ID!
  person: Person!
  tag: Tag!
  radius_miles: Float
  whole_city: Boolean
}

type SendType {
  id: ID!
  person: Person!
  type: SendEnum!
  email: String
  phone: String
}

extend type Query {
  message(id: ID!): Message
  category(id: ID!): Category
  person(id: ID!): Person
  people: [Person]
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
  createPerson(person: PersonInput!): Person
  deletePerson(id: ID!): Int
}

input PersonInput {
  location_x: Float
  location_y: Float
  send_types: [SendTypeInput]
  subscriptions: [SubscriptionInput]
}

input SubscriptionInput {
  tag_id: ID!
  radius_miles: Float
  whole_city: Boolean
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

enum SendEnum {
  EMAIL
  TEXT
  VOICE
  PUSH
}
`;
module.exports = schema;
