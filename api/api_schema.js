const schema = `

type Message {
  id: ID
  message: String
  sent: Boolean
  datesent: String
  topic: Topic
  subscrs: [Subscr]
}

type Topic {
  id: ID
  name: String
  tags: [Tag]
  messages: [Message]
}

type Tag {
  id: ID
  name: String
  topics: [Topic]
  category: Category
  people: [Person]
}

type Category {
  id: ID
  name: String
  tags: [Tag]
}

type Subscr {
  person: Person
  tag: Tag
}

type Person {
  email: String
  phone: String
  email_verified: Boolean
  phone_verified: Boolean
  send_email: Boolean
  send_text: Boolean
  send_push: Boolean
  send_voice: Boolean
  tags: [Tag]
}

extend type Query {
  message(id: ID): Message
  category(id: ID): Category
  person(id: ID): Person
  tag(id: ID): Tag
  tags: [Tag]
}

extend type Mutation {
  createTopic(input: String): Topic
  """
  Dummy is defined in ../schema.js
  """
  test2: Dummy 
}
`;
module.exports = schema;
