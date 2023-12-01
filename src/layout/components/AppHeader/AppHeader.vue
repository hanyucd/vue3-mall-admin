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
      <el-tooltip effect="dark" :content="collapseMenuTooltipText" placement="bottom">
        <el-icon class="icon-btn" @click="$store.commit('SWITCH_SIDEBAR_MENU_STATE')">
          <Fold v-if="!$store.state.isCollapseSidebarMenu" />
          <Expand v-else />
        </el-icon>
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
  <FormDrawer ref="formDrawerRef" title="修改密码" destroy-on-close @formDrawerSubmitEvt="onFormDrawerSubmitEvt" @formDrawerCloseEvt="onFormDrawerCloseEvt">
    <el-form ref="formRef" :model="passwordForm" :rules="passwordRules" label-width="80px" size="large" class="flex flex-col min-h-full">
      <el-form-item prop="oldpassword" label="旧密码">
        <el-input v-model="passwordForm.oldpassword" size="large" show-password placeholder="请输入旧密码" />
      </el-form-item>
      <el-form-item prop="password" label="新密码">
        <el-input v-model="passwordForm.password" size="large" show-password placeholder="请输入密码" />
      </el-form-item>
      <el-form-item prop="repassword" label="确认密码">
        <el-input v-model="passwordForm.repassword" size="large" show-password placeholder="请输入确认密码" />
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import FormDrawer from '@/components/FormDrawer/FormDrawer.vue';
import { useFullscreen } from '@vueuse/core';
import { useStore } from 'vuex';
// import { useUserLogoutHook } from '@/hooks/useUserHook';
import * as useUserHook from '@/hooks/useUserHook';
import { computed, ref, reactive } from 'vue';

const store = useStore();
// 退出登录 hook
const { handleLogout } = useUserHook.useUserLogoutHook();
// 修改密码 hook
// const modifPasswordHook = useUserHook.useModifPasswordHook();
const { passwordForm, passwordRules, formRef, formDrawerRef, onFormDrawerSubmitEvt, onFormDrawerCloseEvt } = useUserHook.useModifPasswordHook();

// 是否全屏
const { isFullscreen, toggle } = useFullscreen();
// 折叠菜单 tooltip 文本
const collapseMenuTooltipText = computed(() => store.state.isCollapseSidebarMenu ? '展开侧边栏' : '折叠侧边栏');

/**
 * 刷新页面
 */
const handleRefresh = () => location.reload();

/**
 * 点击菜单项触发的事件回调
 */
const onDropdownItemCommandEvt = command => {
  switch(command) {
    case 'logout':
      handleLogout();
      break;
    case 'modifPassword':
      formDrawerRef.value.openFormDrawer();
      break;
    default:
      break;
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
