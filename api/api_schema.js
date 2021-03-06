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

type UserPreference {
  id: ID!
  location_x: Float
  location_y: Float
  send_types: [SendType]
  subscriptions: [Subscription]
}

type Subscription {
  id: ID!
  user_preference: UserPreference!
  tag: Tag!
  radius_miles: Float
  whole_city: Boolean
}

type SendType {
  id: ID!
  user_preference: UserPreference!
  type: SendEnum!
  email: String
  phone: String
}

type DeleteReturn {
  deletedEmail: String
  error: ErrorMsg
}

extend type Query {
  message(id: ID!): Message
  category(id: ID!): Category
  user_preference(email: String!): UserPreference
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
  createUserPreference(user_preference: UserPreferenceInput!): UserPreference
  updateUserPreference(user_preference: UserPreferenceInput!): UserPreference
  deleteUserPreference(email: String!): DeleteReturn
  deleteUserPreferenceSecure(url: String!): DeleteReturn
}

input UserPreferenceInput {
  id: ID
  location_x: Float
  location_y: Float
  send_types: [SendTypeInput]
  subscriptions: [SubscriptionInput]
}

input SubscriptionInput {
  id: ID
  tag: TagInput!
  radius_miles: Float
  whole_city: Boolean
}

input SendTypeInput {
  type: SendEnum!
  email: String
  phone: String
}

input TagInput {
  id: ID
  name: String
  category: ID
}

enum SendEnum {
  EMAIL
  TEXT
  VOICE
  PUSH
}

enum ErrorMsg {
  BADHASH
  EXPIRED
}
`;
module.exports = schema;
