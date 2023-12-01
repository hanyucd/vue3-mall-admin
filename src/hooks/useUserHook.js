import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ref, reactive } from 'vue';
import * as commonUtil from '@/common/utils';

/**
 * 退出登录 Hook
 */
export const useUserLogoutHook = () => {
  const router = useRouter();
  const store = useStore();

  function handleLogout() {
    commonUtil.elMsgBoxConfirm('是否退出登录？')
      .then(res => {
        console.log(res);
        store.dispatch('userModule/userLogoutAction')
          .then(_ => {
            console.log(_);
            router.push('/login');
          }); 
      });
  }

  return { handleLogout };
};

/**
 * 修改密码 Hook
 */
export const useModifPasswordHook = () => {
  const router = useRouter();
  const store = useStore();

  // 用户密码表单信息
  const passwordForm = reactive({ oldpassword: '', password: '', repassword: '' });

  // 验证密码
  const checkPass = (rule, value, callback) => {
    const reg =  /^(?=.*\d).{5,16}$/;
    if (!reg.test(value)) {
      return callback(new Error('密码至少包含一个数字'));
    }
    callback();
  };
  // 验证确认密码
  const checkRePass = (rule, value, callback) => {
    if (value !== passwordForm.password) {
      return callback(new Error('密码不一致'));
    }
    callback();
  };

  // 密码规则
  const passwordRules = {
    oldpassword: [
      { required: true, message: '请输入旧密码', trigger: 'blur' },
      { min: 5, max: 16, message: '密码长度为5到16个字符', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 5, max: 16, message: '密码长度为5到16个字符', trigger: 'blur' },
      { validator: checkPass, trigger: 'blur' }
    ],
    repassword: [
      { required: true, message: '请输入确认密码', trigger: 'blur' },
      { min: 5, max: 16, message: '密码长度为5到16个字符', trigger: 'blur' },
      { validator: checkRePass, trigger: 'blur' }
    ]
  };

  const formRef = ref(null); // 密码表单节点引用
  const formDrawerRef = ref(null); // 表单 Drawer 组件引用

  /**
   * 提交密码修改
   */
  function onFormDrawerSubmitEvt() {
    formRef.value.validate((valid) => {
      if (!valid) return false;
      // 显示提交按钮 loading
      formDrawerRef.value.showSubmitBtnLoading();

      store.dispatch('userModule/updateUserPasswordAction', passwordForm)
        .then(res => {
          console.log(res);

          // 关闭表单抽屉
          formDrawerRef.value.closeFormDrawer();
          commonUtil.elNotify('密码修改成功,请重新登录!');
          store.dispatch('userModule/userLogoutAction');
      })
      .then(res => {
        router.push('/login');
      })
      .finally(() => {
        // 隐藏loading
        formDrawerRef.value.hideSubmitBtnLoading();
      });
    });
  }

  /**
   * 关闭密码修改Drawer close 事件
   */
  function onFormDrawerCloseEvt() {
    console.log('关闭 hook');
    passwordForm.oldpassword = passwordForm.password = passwordForm.repassword = '';
  }

  return { passwordForm, passwordRules, formRef, formDrawerRef, onFormDrawerSubmitEvt, onFormDrawerCloseEvt };
};
