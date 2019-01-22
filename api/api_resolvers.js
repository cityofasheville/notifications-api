
const tagsData = [
  {
    id: '1',
    name: '28801',
    topics: [
      {
        id: '10',
        name: 'Montford Gardens',
      },
      {
        id: '20',
        name: 'Montford Estates',
      },
    ],
  },
  {
    id: '2',
    name: '28803',
    topics: [
      {
        id: '30',
        name: 'West Gardens',
      },
    ],
  },
];

const resolvers = {
  Query: {
    tag:
      // eslint-disable-next-line no-unused-vars
      (parent, args, context) => tagsData.find(tag => tag.id === args.id),
    tags:
      (parent, args, context) => tagsData, // eslint-disable-line no-unused-vars
    topics:
      (parent, args, context) => tagsData[0].topics, // eslint-disable-line no-unused-vars
  },
};
module.exports = resolvers;

/*
query {
  topics{
    name,
  },
  tags {
    name,
  },
  tag(id: "2"){
    name
  }
}
*/
