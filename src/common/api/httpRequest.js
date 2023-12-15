import axios from 'axios';
import store from '@/store';
import authUtil from '@/common/utils/authUtil';
import * as commonUtil from '@/common/utils';

const http = axios.create({
  // API 请求的默认前缀
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
});

/**
 * 请求拦截器
 */
http.interceptors.request.use(config => {
  config.headers['X-Timestamp'] = new Date().getTime().toString().substr(0, 10);
  config.headers['X-Nonce'] = Math.random().toString(36).slice(-10);
  config.headers['X-Api-Version'] = 'v1';
  config.headers['X-Device-Type'] = 'admin';
  // 获取用户token
  const userToken = authUtil.getUserToken();
  userToken && (config.headers['token'] = userToken);

  return config;
}, error => {
  return Promise.reject(error);
});

/**
 * 响应拦截器
 */
http.interceptors.response.use(response => {
  // 2xx 范围内的状态码都会触发该函数
  // console.log(response);
  const resData = response.data;

  return resData;
}, error => {
  // 超出 2xx 范围的状态码都会触发该函数
  // console.log('错误', error);
  const msg = error?.response.data.msg || '请求失败';

  if (msg == '非法token，请先登录！') {
    store.commit('userModule/CLEAR_USER_DATA');
    location.reload();
    // store.dispatch('userModule/userLogoutAction').finally(() => location.reload());
  }
  
  commonUtil.elNotify(msg, 'error');
  return Promise.reject(error);
});


const httpRequest = (url = '', data = {}, method = 'get', otherConfig = {}) => {
  return http.request({
    url,
    method: method.toLowerCase(),
    [method === 'get' ? 'params' : 'data']: data,
    ...otherConfig
  });
};

export default httpRequest;
