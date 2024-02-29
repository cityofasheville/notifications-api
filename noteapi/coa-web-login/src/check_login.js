// const cache = require('../cache/cache');
import decodeToken from './decode_token.js';
import josepkg from 'node-jose';
const { util } = josepkg;
import axios from 'axios';
import { stringify } from 'qs';

const checkLogin = function (sessionId, cacheData = null, cache) {
  if (cacheData) cacheData.sessionState.loggedIn = false;
  if (cacheData && cacheData.id_token) {
    if (!cacheData.sessionState) cacheData.sessionState = {};
    // get the kid from the headers prior to verification
    let header = JSON.parse(util.base64url.decode(cacheData.id_token.split('.')[0]));
    let kid = header.kid;

    return decodeToken(kid, process.env.appClientId, cacheData.id_token, 'test', cache)
    .then(result => {
      if (result.status == 'expired') {
        // for refresh see https://docs.aws.amazon.com/cognito/latest/developerguide/token-endpoint.html
        const refreshData = {
          grant_type: 'refresh_token',
          scope: 'email openid profile',
          client_id: process.env.appClientId,
          refresh_token: cacheData.refresh_token,
          redirect_uri: '',
        };
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
        };      
        return axios({
          method: 'post',
          url: process.env.cognitoOauthUrl,
          data: stringify(refreshData),
          headers,
        })
        .then((response) => {
          if (response.status == 200) {
            // get the kid from the headers prior to verification
            const sections = response.data.id_token.split('.');
            header = JSON.parse(util.base64url.decode(sections[0]));
            kid = header.kid;
            return decodeToken(kid, process.env.appClientId, response.data.id_token, 'refresh_token', cache)
            .then(result => {
              if (result.status !== 'ok') throw new Error(`Error decoding token: ${result.status}`);
              const claims = result.claims;
              cacheData.sessionState.loggedIn =true;
              cacheData.sessionState.loginProvider = 'Unknown';
              if (result.claims.identities && result.claims.identities.length > 0) {
                cacheData.sessionState.loginProvider = result.claims.identities[0].providerName;
              }
              if (cache) {
                cache.store(sessionId,
                  Object.assign(cacheData, {
                    id_token: response.data.id_token,
                    access_token: response.data.access_token,
                  }));
              }
              return Promise.resolve(true);
            });
          }      
        });
      } else if (result.status == 'ok') {
        cacheData.sessionState.loggedIn =true;
        cacheData.sessionState.loginProvider = 'Unknown';
        if (result.claims.identities && result.claims.identities.length > 0) {
          cacheData.sessionState.loginProvider = result.claims.identities[0].providerName;
        }
        if (cache) {
          cache.store(sessionId, cacheData);
        }
      } else {
        throw new Error(`Login expired - you will need to log in again (Status: ${result.status})`);
      }
      return Promise.resolve(cacheData.sessionState.loggedIn);
    })
    .catch(err => {
      if (err) console.log(`Error checking login: ${err}`);
    });
  }
  return Promise.resolve(false);
};
export default checkLogin;
