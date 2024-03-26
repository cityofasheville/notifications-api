import registerCode from './register_code.js';
import logout from './logout.js';

const resolvers = {
  Mutation: {
    registerCode,
    logout,
  },
};

export default resolvers;
