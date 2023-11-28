import axios from 'axios';

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
  return config;
}, error => {
  return Promise.reject(error);
});

/**
 * 响应拦截器
 */
http.interceptors.response.use(response => {
  // 2xx 范围内的状态码都会触发该函数
  console.log(response);
  
  const resData = response.data;

  if (resData.code !== 0) {
    // Message.error({ message: resData.message || '服务错误' });
    return Promise.reject(resData);
  }

  return resData;
}, error => {
  // 超出 2xx 范围的状态码都会触发该函数
  console.log(error);
  return Promise.reject(error);
});


const httpRequest = (url = '', data = {}, method = 'get') => {
  return http.request({
    url,
    method: method.toLowerCase(),
    [method === 'get' ? 'params' : 'data']: data
  });
};

export default httpRequest;
