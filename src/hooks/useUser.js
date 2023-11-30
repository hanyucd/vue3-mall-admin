import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import * as commonUtil from '@/common/utils';

/**
 * 触发退出登录
 */
export const useUserLogout = () => {
  const router = useRouter();
  const store = useStore();
  console.log(store);
  console.log(router);

  commonUtil.elMsgBoxConfirm('是否退出登录？')
    .then(res => {
      console.log(res);
      store.dispatch('userModule/userLogoutAction')
        .then(_ => {
          console.log(_);
          router.push('/login');
        }); 
    });

    return { a: 1 };
};
