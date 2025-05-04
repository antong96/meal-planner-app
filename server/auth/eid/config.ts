import { config } from '../../config';

export const eidConfig = {
  clientId: config.EID_CLIENT_ID,
  clientSecret: config.EID_CLIENT_SECRET,
  redirectUri: config.EID_REDIRECT_URI,
  authUrl: 'https://innskraning.island.is/oauth2/authorize',
  tokenUrl: 'https://innskraning.island.is/oauth2/token',
  userInfoUrl: 'https://innskraning.island.is/oauth2/userinfo',
  scopes: ['openid', 'profile', 'nationalId'],
};

export default eidConfig; 