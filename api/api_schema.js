const schema = `
type Book {
  title: String
  author: String
  secret: String
}

extend type Query {
  "This is documentation"
  books: [Book]
}

`;
module.exports = schema;

