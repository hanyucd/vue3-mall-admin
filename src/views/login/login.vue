<template>
  <el-row class="login-container">
    <!-- 左边 -->
    <el-col :lg="16" :md="12" class="left-box">
      <div>
        <h3>欢迎光临</h3>
        <p>技术栈：Vue3 + ElementPlus + Vue-Router + WindiCSS 实战商城后台项目</p>
        <h5 class=" text-white mt-2 text-md">账号: admin  密码: admin</h5>
      </div>
    </el-col>

    <!-- 右边 -->
    <el-col :lg="8" :md="12" class="right-box">
      <h3>欢迎回来</h3>
      <div class="sub-title">
        <span class="line"></span>
        <span>账号密码登录</span>
        <span class="line"></span>
      </div>

      <el-form ref="userFormRef" :rules="userFormRules" :model="userForm" class="w-[250px]">
        <el-form-item prop="username">
          <el-input v-model="userForm.username" size="large" placeholder="请输入用户名">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="userForm.password" type="password" show-password size="large" placeholder="请输入密码">
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="w-[250px]" round color="#626aef" size="large" type="primary" :loading="userLoginLoading" @click="handleUserLogin" @keyup.enter="handleUserLogin"> 登 录 </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();
const { proxy } = getCurrentInstance();

const userFormRef = ref(null); // 表单DOM节点引用 Ref
const userLoginLoading = ref(false); // 用户登录状态
// 用户登录表单信息
const userForm = reactive({
  username: '',
  password: '',
});
// 用户登录表单验证规则
const userFormRules = {
  username: [ { required: true, message: '用户名不能为空', trigger: 'blur' } ],
  password: [ { required: true, message: '密码不能为空', trigger: 'blur' } ]
};

onMounted(() => {
  // 添加键盘监听事件
  document.addEventListener('keyup', onKeyupEvt);
});

onBeforeUnmount(() => {
  // 移除键盘监听事件
  document.removeEventListener('keyup', onKeyupEvt);
});

/**
 * 监听键盘回车函数
 */
const onKeyupEvt = event => {
  (event.key === 'Enter') && handleUserLogin();
};

/**
 * 用户登录
 */
const handleUserLogin = () => {
  userFormRef.value.validate(valid => {
    if (!valid) return false;
    // 打开登录状态
    userLoginLoading.value = true;

    store.dispatch('userModule/userLoginAction', { username: userForm.username.trim(), password: userForm.password.trim() })
      .then(res => {
        console.log(res);
        proxy.$commonUtil.elNotify('登录成功');
        router.replace('/');
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        userLoginLoading.value = false;
      }); 
  });
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
