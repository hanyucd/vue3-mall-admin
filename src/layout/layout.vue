<template>
  <el-container class="layout">
    <!-- 头部 -->
    <el-header>
      <AppHeader />
    </el-header>
    
    <el-container style="height: 0;">
      <!-- 侧边栏 -->
      <el-aside>
        <SidebarMenu />
      </el-aside>
      <el-main>
        <!-- 导航标签组 -->
        <NavTagGroup />

        <!-- 内容 -->
        <router-view v-slot="{ Component }" class="main-container">
          <Transition name="fade" mode="out-in">
            <keep-alive :max="10">
              <component :is="Component" />
            </keep-alive>
          </Transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import AppHeader from './components/AppHeader/AppHeader.vue';
import SidebarMenu from './components/SidebarMenu/SidebarMenu.vue';
import NavTagGroup from './components/NavTagGroup/NavTagGroup.vue';
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
