const schema = `
  type LoginResult {
    loggedIn: Boolean
    message: String
    reason: String
  }

  extend type Mutation {
    registerCode (code: String!, redirect_uri: String!): LoginResult
    logout: LoginResult
  }
`;
export default schema;
