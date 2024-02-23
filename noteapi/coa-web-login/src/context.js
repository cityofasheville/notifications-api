const initializeContext = function () {

  return {
    email: null,
    loginProvider: null,
    user: {},
    sessionState: { loggedIn: false },
    id_token: null,
    access_token: null,
    refresh_token: null,
  };
};

export default initializeContext;
