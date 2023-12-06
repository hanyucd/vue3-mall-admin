<template>
  <el-container class="bg-white rounded">
    <el-header>
      <el-button type="primary" @click="openAddImageClassDrawer">新增图片分类</el-button>
      <el-button type="warning" @click="openUploadFileDrawer">上传图片</el-button>
    </el-header>
    
    <el-container>
      <ImageAside ref="imageAsideRef" @changeImageClassEvt="onChangeImageClassEvt" />
      <ImageMain ref="imageMainRef" />
    </el-container>
  </el-container>
</template>

<script setup>
import ImageAside from '@/components/ImageAside/ImageAside.vue';
import ImageMain from '@/components/ImageMain/ImageMain.vue';
import { ref } from 'vue';

const imageAsideRef = ref(null);
const imageMainRef = ref(null);

/**
 * 打开新增图片分类 drawer
 */
const openAddImageClassDrawer = () => imageAsideRef.value.openAddImageClassDrawer();

/**
 * 监听侧边栏 图片分类改变 事件
 */
const onChangeImageClassEvt = imageClassId => {
  imageMainRef.value.fetchImageList(imageClassId);
};

/**
 * 打开上传文件 drawer
 */
const openUploadFileDrawer = () => imageMainRef.value.openUploadFileDrawer();
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
