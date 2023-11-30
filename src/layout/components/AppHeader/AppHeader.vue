<template>
  <div class="app-header-container">
    <div class="logo">
      <el-icon class="mr-1">
        <eleme-filled />
      </el-icon>
      <h3 class="pl-3 text-white">Vue3商城后台</h3>
    </div>

    <div class="flex items-center">
      <!-- 折叠 -->
      <el-tooltip effect="dark" :content="menuText" placement="bottom">
        <el-icon class="icon-btn" @click="toggleMenu"><Fold /></el-icon>
      </el-tooltip>
      <!-- 刷新 -->
      <el-tooltip effect="dark" content="刷新" placement="bottom">
        <el-icon class="icon-btn" @click="handleRefresh"><Refresh /></el-icon>
      </el-tooltip>
    </div>

    <div class="flex items-center ml-auto">
      <!-- 全屏 -->
      <el-tooltip effect="dark" :content="isFullscreen ? '取消全屏' : '全屏'" placement="bottom">
        <el-icon class="icon-btn" @click="toggle">
          <FullScreen v-if="!isFullscreen" />
          <Aim v-else />
        </el-icon>
      </el-tooltip>

      <!-- 昵称下拉菜单 -->
      <el-dropdown class="px-7" @command="onDropdownItemCommandEvt">
        <div class="el-dropdown-link">
          <el-avatar :size="40" :src="'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" />
          <span class="pl-3">{{ '管理员' }}</span>
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="modifPassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <!-- 表单Drawer -->
  <FormDrawer ref="formDrawerRef" title="修改密码" destroy-on-close @formDrawerSubmitEvt="onFormDrawerSubmitEvt">
    <div>
      123
      <div :style="{ height: '2000px', background: 'red' }">
      </div>
    </div>
  </FormDrawer>
</template>

<script setup>
import FormDrawer from '@/components/FormDrawer/FormDrawer.vue';
import { useFullscreen } from '@vueuse/core';
import { useUserLogout } from '@/hooks/useUser';
import { computed, ref } from 'vue';

// 是否全屏
const { isFullscreen, toggle } = useFullscreen();
// eslint-disable-next-line no-constant-condition
const menuText = computed(() => 1 ? '展开侧边栏' : '折叠侧边栏');

const formDrawerRef = ref(null);

/**
 * 刷新页面
 */
const handleRefresh = () => location.reload();

const onFormDrawerSubmitEvt = () => {
  console.log('监听子组件事件');
};

/**
 * 点击菜单项触发的事件回调
 */
const onDropdownItemCommandEvt = command => {
  console.log(command);

  switch(command) {
    case 'logout':
      // useUserLogout();
      console.log(useUserLogout());
      break;
    case 'modifPassword':
      formDrawerRef.value.openFormDrawer();
      formDrawerRef.value.showSubmitBtnLoading();
      console.log(formDrawerRef.value);
      break;
    default:
      break;
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
