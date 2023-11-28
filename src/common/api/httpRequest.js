import axios from 'axios';

const http = axios.create({
  // API 请求的默认前缀
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
});


const httpRequest = (url = '', data = {}, method = 'get') => {
  return http.request({
    url,
    method: method.toLowerCase(),
    [method === 'get' ? 'params' : 'data']: data
  });
};

export default httpRequest;
