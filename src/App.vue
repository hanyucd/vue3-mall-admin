<template>
  <!-- <el-row class="mb-4">
    <el-button>Default</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
  </el-row> -->

  <router-view />
</template>

<script setup>
import HelloWorld from './components/HelloWorld.vue';
</script>

<style>
#nprogress .bar {
  background: #24edb2 !important;
}
</style>

