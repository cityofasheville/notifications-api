const schema = `

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
  tag(id: ID): Tag 
  tags: [Tag]
  topics: [Topic]
}

`;
module.exports = schema;
