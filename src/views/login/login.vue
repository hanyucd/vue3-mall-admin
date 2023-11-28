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

      <el-form ref="formRef" :model="form" class="w-[250px]">
        <el-form-item prop="username">
          <el-input v-model="form.username" size="large" placeholder="请输入用户名">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" show-password size="large" placeholder="请输入密码">
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="w-[250px]" round color="#626aef" size="large" type="primary" :loading="loading" @click="onSubmit"> 登 录 </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import { reactive, ref } from 'vue';

const loading = ref(false);

const form = reactive({
  username: '',
  password: '',
});

const onSubmit = () => {
  console.log('提交');
};

</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
