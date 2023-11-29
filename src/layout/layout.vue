<template>
  <el-container>
    <el-header>
      <AppHeader />
    </el-header>
    
    <el-container>
      <el-aside>
        侧边栏
      </el-aside>
      <el-main>主要内容</el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import AppHeader from './components/AppHeader/AppHeader.vue';
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
