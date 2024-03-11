import getEmployeeInfo from './get_employee_info.js';
import baseUser from './base_user.js';

const getNonCityUser = (sessionId, cachedContext, cache) => {
  let user = baseUser;
  if (cachedContext.sessionState.loggedIn) {
    user = Object.assign({}, baseUser, { email: cachedContext.email });
    return cache.store(sessionId, Object.assign({}, cachedContext, { user }))
      .then((status) => {
        if (status !== 'OK') console.log('Error storing non-City user to cache');
        return Promise.resolve(user);
      });
  }
  return Promise.resolve(user);
};

const getUserInfo = (sessionId, cachedContext, config, cache, dbConn) => {
  const isGoogle = (cachedContext.loginProvider === 'Google');
  const isLoggedIn = cachedContext.sessionState.loggedIn;
  const email = (cachedContext.email) ? cachedContext.email.toLowerCase() : '';
  if (isLoggedIn && config.onlyEmployeeLogins) {
    if (!isGoogle || !email.endsWith('ashevillenc.gov')) {
      throw new Error('Only City of Asheville employees may log in.');
    }
  }
  if (isLoggedIn && config.enableEmployeeLogins && email.endsWith('ashevillenc.gov')) {
    const { user } = cachedContext;

    if (user.id === undefined) {
      const query = 'select emp_id from internal.ad_info where email_city = $1';
      return dbConn.query(query, [cachedContext.email])
        .then((res) => {
          // We could check that it's ashevillenc.gov first, actually.
          if (res.rows.length === 0) return getNonCityUser(sessionId, cachedContext, cache);
          return getEmployeeInfo([res.rows[0].emp_id], cache, null, dbConn)
            .then((u) => {
              cache.store(sessionId, Object.assign({},
                cachedContext, { user: u[0] })); // Should verify success, but skip for now.
              return Promise.resolve(u[0]);
            });
        });
    }
    return Promise.resolve(user);
  }
  return getNonCityUser(sessionId, cachedContext, cache);
};

export default getUserInfo;
