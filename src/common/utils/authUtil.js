import { useCookies } from '@vueuse/integrations/useCookies';
const TokenKey = 'admin-token';

const cookie = useCookies();

// 获取用户 token
const getUserToken = () => {
  return cookie.get(TokenKey);
};

// 设置用户 token
const setUserToken = token => {
  return cookie.set(TokenKey, token);
};

// 清除用户 token
const removeToken = () => {
    return cookie.remove(TokenKey);
};

export default {
  getUserToken,
  setUserToken,
  removeToken
};
