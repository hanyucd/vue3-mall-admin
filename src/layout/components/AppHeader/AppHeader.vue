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
            <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// eslint-disable-next-line no-constant-condition
const menuText = computed(() => 1 ? '展开侧边栏' : '折叠侧边栏');

const isFullscreen = false;

/**
 * 刷新页面
 */
const handleRefresh = () => location.reload();
/**
 * 点击菜单项触发的事件回调
 */
const onDropdownItemCommandEvt = command => {
  console.log(command);
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
