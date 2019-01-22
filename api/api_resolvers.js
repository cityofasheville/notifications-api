const sampleData = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
    secret: 'Hagrid',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
    secret: 'raptor',
  },
];

const resolvers = {
  Query: {
    books:
      (parent, args, context) => sampleData, // eslint-disable-line no-unused-vars
  },
};
module.exports = resolvers;
