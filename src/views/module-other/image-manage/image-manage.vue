<template>
  <el-container class="bg-white rounded">
    <el-header>
      <el-button type="primary" @click="openDrawer">新增图片分类</el-button>
      <el-button type="warning" @click="uploadFile">上传图片</el-button>
    </el-header>
    
    <el-container>
      <ImageAside ref="imageAsideRef" />
      <ImageMain ref="imageMainRef" />
      <!-- <image-aside ref="imageAsideRef" @change="aside_completed" />
      <image-main ref="imageMainRef" /> -->
    </el-container>
  </el-container>
</template>

<script setup>
import ImageAside from '@/components/ImageAside/ImageAside.vue';
import ImageMain from '@/components/ImageMain/ImageMain.vue';
import { reactive, watch } from 'vue';

</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
