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
  people: [Person]
}

type Category {
  id: ID!
  name: String!
  tags: [Tag]
}

type Subscr {
  person: Person!
  tag: Tag!
}

type Person {
  id: ID!
  uuid: String
  send_types: [SendType]
  tags: [Tag]
}

type SendType {
  id: ID!
  person: Person!
  type: SendEnum!
  email: String
  phone: String
  verified: Boolean
}

extend type Query {
  message(id: ID!): Message
  category(id: ID!): Category
  person(id: ID!): Person
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
  deletePerson(id: ID!): Person
}

input PersonInput {
  send_types: [SendTypeInput]
  tags: [TagIDInput]
}

input SendTypeInput {
  type: SendEnum!
  email: String
  phone: String
  verified: Boolean
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

/* deletePerson(email: String, phone: String): Person

let PersonInput = {
  "send_types": [
    {
      "send_type": "EMAIL",
      "email": "aoc@house.gov",
      "verified": false
    }
  ],
  "tags": [
    {
      "tag_id": "2"
    }
  ]
}
*/