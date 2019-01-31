const schema = `

type Message {
  id: ID
  msg: String
  topic: Topic
  sent: Boolean
  datesent: String
}

type Category {
  id: ID
  name: String
  tags: [Tag]
  topics: [Topic]  
}

type Tag {
  id: ID
  name: String
  topics: [Topic]
}

type Topic {
  id: ID
  name: String
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
