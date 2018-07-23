import axios from 'axios';
import {loadSpinnerStore} from '../stores';
import {OAUTH} from '../constants/oauth-constants';
import {OAuthHelper} from '../helpers/OAuthHelper';

const errorHandler = (error) => {
  loadSpinnerStore.dec();
  return Promise.reject(error);
};

export const makeFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => formData.append(key, value));
  return formData;
};

const instance = axios.create({
  baseURL: OAUTH.BASE_URL,
});

instance.interceptors.request.use(
    (config) => {
      loadSpinnerStore.inc();
      return config;
    },
    errorHandler,
);

// Add a response interceptor
instance.interceptors.response.use(
    (response) => {
      loadSpinnerStore.dec();
      return response;
    },
    errorHandler,
);

const requestFn = async (method, url, data, cb, errorCb, secure, accessToken) => {
  let obj;
  if (method === 'get') {
    obj = instance.get(url, {
      params: data,
      headers: secure === false ? undefined : {Authorization: `Bearer ${accessToken}`},
    });
  } else if (method === 'post' || method === 'put') {
    obj = instance.post(url, makeFormData(data), {
      headers: secure === false ? undefined : {Authorization: `Bearer ${accessToken}`},
    });
  } else {
    return;
  }
  obj
      .then(cb)
      .catch((error) => {
        console.log(error);
        console.log(error.config);
      });
};

const request = async (method, url, data, cb, errorCb, secure) => {
  if (secure === false) {
    await requestFn(method, url, data, cb, errorCb, secure);
  } else {
    OAuthHelper.getAccessToken(async (n, accessToken) => {
      await requestFn(method, url, data, cb, errorCb, secure, accessToken);
    });
  }
};

const post = async (url, data, cb, errorCb, secure) => {
  await request('post', url, data, cb, errorCb, secure);
};

const get = async (url, data, cb, errorCb, secure) => {
  await request('get', url, data, cb, errorCb, secure);
};

export const Http = {
  post,
  get,
};
