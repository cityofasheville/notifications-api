const schema = `

type Category {
  id: String
  name: String
  tags: [Tag]
  topics: [Topic]  
}

type Tag {
  id: String
  name: String
  topics: [Topic]
}

type Topic {
  id: String
  name: String
}

extend type Query {
  category(id: ID): Category
  tag(id: ID): Tag 
  tags: [Tag]
  topics: [Topic]
}

extend type Mutation {
  createTopic(input: String): Topic
  test2: Dummy
}
`;
module.exports = schema;
