/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-param-reassign */
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import store from 'store';
import { Toast } from '@douyinfe/semi-ui';

function requestAPI<T>(axiosConfig: AxiosRequestConfig): AxiosPromise<T> {
  const service = axios.create({
    timeout: 10000,
  });

  service.interceptors.response.use((response) => {
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
