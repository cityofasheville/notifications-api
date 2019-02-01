const schema = `

type Message {
  id: ID
  msg: String
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
  subscrs: [Subscr]
}

type Category {
  id: ID
  name: String
  tags: [Tag]
}

type Subscr {
  person: People
  tag: Tag
}

type People {
  subscrs: [Subscr]
}

extend type Query {
  message(id: ID): Message
  category(id: ID): Category
  tag(id: ID): Tag
  tags: [Tag]
  topics: [Topic]
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
