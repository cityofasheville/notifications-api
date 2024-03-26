
const logout = function (parent, args, context) {
  context.cache.del(context.sessionId);
  return Promise.resolve({ loggedIn: false, message: 'Goodbye', reason: 'No reason' });
};

export default logout;
