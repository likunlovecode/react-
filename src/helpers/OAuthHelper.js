import SecureLS from 'secure-ls';
import {OAUTH} from '../constants/oauth-constants';
import {STORAGE} from '../constants/storage-constants';
import {Http} from './Http';
import {mainStore, authStore} from '../stores';
import {message} from 'antd';

let accessToken;
const ls = new SecureLS({encodingType: 'aes'});

export const OAuthHelper = {
  setData(data, cb) {
    const expiresInMs = (data.expires_in - 10) * 1000;
    ls.set(STORAGE.OAUTH.REFRESH_TOKEN, data.refresh_token);
    ls.set(STORAGE.OAUTH.EXPIRED_TIME, `${new Date().getTime() + expiresInMs}`);
    accessToken = data.access_token;
    OAuthHelper.fetchUserDetails(cb);
  },
  fetchUserDetails(cb) {
    let url = '';
    if (OAUTH.CLIENT_ID === 'admin') {
      url = '/api/v1/admin/info';
    } else {
      url = '/api/v1/user/info';
    }
    Http.get(url, {}, (response) => {
      mainStore.authUser = response.data.data;
      if (cb) {
        cb(response.data);
      }
    });
  },
  async getAccessToken(cb, loginCb) {
    if (!OAuthHelper.check()) {
      OAuthHelper.autoLogin(cb, loginCb);
    } else {
      authStore.setLogStatus(true);
      cb(null, accessToken);
    }
  },
  check() {
    const expiredTime = ls.get(STORAGE.OAUTH.EXPIRED_TIME);
    return expiredTime && accessToken && new Date().getTime() < Number(expiredTime);
  },
  cleanStorage() {
    accessToken = null;
    authStore.setLogStatus(false);
    ls.remove(STORAGE.OAUTH.REFRESH_TOKEN);
    ls.remove(STORAGE.OAUTH.EXPIRED_TIME);
  },

  login(username, password, cb) {
    Http.post('/oauth/token', {
      grant_type: 'password',
      username,
      password,
      client_id: OAUTH.CLIENT_ID,
      client_secret: OAUTH.CLIENT_SECRET,
    }, (response) => {
      if (response.data.error) {
        message.error(response.data.error);
      } else {
        OAuthHelper.setData(response.data, cb);
      }
    }, () => {
      OAuthHelper.cleanStorage();
      window.alert('Login failed, please verify your login information.');
    }, false);
  },

  autoLogin(cb, loginCb) {
    const refreshToken = ls.get(STORAGE.OAUTH.REFRESH_TOKEN);
    if (refreshToken) {
      Http.post('/oauth/token', {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: OAUTH.CLIENT_ID,
        client_secret: OAUTH.CLIENT_SECRET,
      }, (response) => {
        OAuthHelper.setData(response.data, () => {
          if (cb) {
            cb(response.data, accessToken);
          }

        });
      }, () => {
        OAuthHelper.cleanStorage();
        window.alert('');
      }, false);
    } else {
      loginCb();
    }
  },
};
