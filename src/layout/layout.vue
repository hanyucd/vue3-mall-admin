<template>
  <el-container class="layout">
    <el-header>
      <AppHeader />
    </el-header>
    
    <el-container>
      <el-aside>
        <SidebarMenu />
      </el-aside>
      <el-main>主要内容</el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import AppHeader from './components/AppHeader/AppHeader.vue';
import SidebarMenu from './components/SidebarMenu/SidebarMenu.vue';
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
