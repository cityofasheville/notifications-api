const getPublicKeys = function (cache = null) {
  const keysUrl = `https://cognito-idp.${process.env.region}.amazonaws.com/${process.env.userpoolId}/.well-known/jwks.json`;
  const publicKeys = null;
  if (cache) cache.get('public_keys');
  if (publicKeys) {
    return Promise.resolve(publicKeys);
  } else {
    return fetch(keysUrl)
    .then(response => {
      if (response.status == 200) {
        return response.json();
      }
      throw new Error('Unable to retrieve Cognito public keys for authentication');  
    })
    .then(data => {
      const keys = data['keys'];
      if (cache) cache.store('public_keys', keys, 24);
      return Promise.resolve(keys);
    });
  }
}

export default getPublicKeys;
