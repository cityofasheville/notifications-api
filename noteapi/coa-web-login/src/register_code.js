/* eslint-disable */
import axios from 'axios';
import josepkg from 'node-jose';
const { util } = josepkg;
import decodeToken from './decode_token.js';
import getPublicKeys from './get_public_keys.js';
import { stringify } from 'qs';
import initializeContext from './context.js';

const registerCode = function (parent, args, context) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  let cacheData = initializeContext();

  const data = {
    grant_type: 'authorization_code',
    scope: 'email openid profile',
    client_id: process.env.appClientId,
    code: args.code,
    redirect_uri: args.redirect_uri,
//     redirect_uri: 'http://localhost:3000/login',
  };

  let sections = null;
  let header = null;
  let kid = null;
  let token = null;

  // Code adapted from https://github.com/awslabs/aws-support-tools/blob/master/Cognito/decode-verify-jwt/decode-verify-jwt.js
  return context.cache.get(context.sessionId)
  .then (cdata => {
    if (cdata) cacheData = cdata;
    return axios({
      method: 'post',
      url: process.env.cognitoOauthUrl,
      data: stringify(data),
      headers,
    });
  })
  .then((response) => {
    token = response.data.id_token;

    sections = token.split('.');
    // get the kid from the headers prior to verification
    header = JSON.parse(util.base64url.decode(sections[0]));
    kid = header.kid;
    return decodeToken(kid, process.env.appClientId, token)
    .then(result => {
      if (result.status !== 'ok') throw new Error(`Error decoding token: ${result.status}`);
      const claims = result.claims;

      let loginProvider = 'Unknown';
      if (claims.identities && claims.identities.length > 0) {
        loginProvider = claims.identities[0].providerName;
      }
      context.cache.store(context.sessionId, Object.assign(cacheData, {
          email: claims.email,
          loginProvider,
          sessionState: { loggedIn: true },
          id_token: response.data.id_token,
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
        }));
      return Promise.resolve({ loggedIn: true, message: 'Hi there', reason: 'No reason' });
    });

    throw new Error('Bad response getting Cognito keys');
  })
  .catch(error => {
    console.log(`Back with an error ${error}`);
  });
};

export default registerCode;
