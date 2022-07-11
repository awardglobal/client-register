/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-param-reassign */
import { token_key, expiredAt_key } from './constants';
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import store from 'store';
import { Toast } from '@douyinfe/semi-ui';

function requestAPI<T>(axiosConfig: AxiosRequestConfig): AxiosPromise<T> {
  const service = axios.create({
    baseURL: 'http://192.168.2.25:8888',
    timeout: 10000,
  });

  service.interceptors.request.use((config) => {
    const token = store.get(token_key);
    // typeof window !== "undefined" 兼容ssr
    if (token && typeof window !== 'undefined') {
      config.headers!['x-token'] = `${token}`;
    }

    return config;
  });

  service.interceptors.response.use((response) => {
    if (response.headers['new-token']) {
      store.set(token_key, response.headers['new-token']);
    }
    if (response.headers['new-expires-at']) {
      store.set(expiredAt_key, response.headers['new-expires-at']);
    }
    if (response.data.code === 3 && response.data?.msg) {
      Toast.error(response.data.msg);
      store.clearAll();
      window.location.replace('/login');
    }
    if (response.data.code === 0 && response.data?.msg) {
      Toast.success(response.data.msg);
    }
    if (response.data.code === 7) {
      if (response.data?.msg) Toast.error(response.data.msg);
      return Promise.reject({
        errorMsg: response.data.msg,
      });
    }

    return response.data;
  });

  return service(axiosConfig);
}

export default requestAPI;
