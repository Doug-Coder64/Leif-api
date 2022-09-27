require('isomorphic-fetch');
const jose = require('node-jose');
import { prop } from 'ramda';
import { isEmptyOrNil, writeToErr, writeToWarn } from './common';
import { leifConfig } from './config';

const method = 'authorize';
const region = 'us-east-1';

export const authorize = async (req, res, next) => {
  if (isEmptyOrNil(process.env.AWS_EXECUTION_ENV)) {
    req.user = 'douglaspeterson6@gmail.com';
    req.exp = new Date().getTime() / 1000 + 3600;
    next();
    return;
  }

  try {
    const token = req.headers.authorization;
    if (!token || !token.includes('.')) {
      writeToWarn(req.originalUrl, req.user, 'No token available', 401, method);
      res.status(401).send('Invalid token');
      return;
    }

    const sections = token.split('.');
    let header = jose.util.base64url.decode(sections[0]);

    try {
      header = JSON.parse(header);
    } catch (e) {
      writeToWarn(req.originalUrl, req.user, 'Invalid token', 401, method);
      res.status(401).send('Invalid token');
      return;
    }
    const kid = header.kid;
    // download the public keys
    // eslint-disable-next-line no-undef
    const keysUrl =
      'https://cognito-idp.' + region + '.amazonaws.com/' + leifConfig.userPoolId + '/.well-known/jwks.json';
    const response = await fetch(keysUrl);
    if (!response.ok) {
      await writeToErr(req.originalUrl, req.user, response, 401, method);
      res.status(401).send('Invalid token');
      return;
    }

    const body = await response.json();
    const keys = prop('keys', body);
    // search for the kid in the downloaded public keys
    let keyIndex = -1;
    for (let i = 0; i < keys.length; i++) {
      // eslint-disable-next-line eqeqeq
      if (kid == keys[i].kid) {
        keyIndex = i;
        break;
      }
    }
    if (keyIndex === -1) {
      await writeToErr(req.originalUrl, req.user, 'Public key not found in jwks.json', 401, method);
      res.status(401).send('Invalid token');
      return;
    }
    // construct the public key
    const k = await jose.JWK.asKey(keys[keyIndex]);
    // create verifier
    const verifier = jose.JWS.createVerify(k);
    // verify the signature
    const result = await verifier.verify(token);
    // now we can use the claims
    const claims = JSON.parse(result.payload);
    // additionally we can verify the token expiration
    const currentTS = Math.floor(+new Date() / 1000);
    if (currentTS > claims.exp) {
      writeToWarn(req.originalUrl, req.user, 'Token is expired', 401, method);
      res.status(401).send('Invalid token');
      return;
    }
    // eslint-disable-next-line eqeqeq
    if (claims.aud !== leifConfig.appClientId) {
      await writeToErr(
        req.originalUrl,
        req.user,
        { aud: claims.aud, clientId: leifConfig.appClientId, message: 'Token was not issued for this audience' },
        401,
        method,
      );
      res.status(401).send('Invalid token');
      return;
    }
    req.user = prop('email', claims);
    req.exp = prop('exp', claims);
    next();
  } catch (e) {
    await writeToErr(req.originalUrl, req.user, e, 500, method);
    res.status(500).send('Server Error');
  }
};
