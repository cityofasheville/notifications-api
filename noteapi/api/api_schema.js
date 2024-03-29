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
  user_preference(email: String!): UserPreference
  categories: [Category]
}

extend type Mutation {
  createUserPreference(user_preference: UserPreferenceInput!): UserPreference
  updateUserPreference(user_preference: UserPreferenceInput!): UserPreference
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
export default schema;
