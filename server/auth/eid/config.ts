import { config } from '../../config';

export const eidConfig = {
  clientId: config.EID_CLIENT_ID,
  clientSecret: config.EID_CLIENT_SECRET,
  redirectUri: config.EID_REDIRECT_URI,
  authUrl: 'https://api.signicat.com/oauth/authorize',
  tokenUrl: 'https://api.signicat.com/oauth/token',
  userInfoUrl: 'https://api.signicat.com/oauth/userinfo',
  scopes: ['openid', 'profile', 'nationalId']
};

export default eidConfig; 