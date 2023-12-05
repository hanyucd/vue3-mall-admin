<template>
  <el-aside v-loading="isLoading" width="220px">
    <div class="content">
      <div v-for="(item, index) in imageClassList" :key="index">
        <ImageAsideItem :active="activeImageClassId === item.id">{{ item.name }}</ImageAsideItem>
      </div>
    </div>
    <div class="footer">脚步</div>
  </el-aside>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
import ImageAsideItem from '@/components/ImageAsideItem/ImageAsideItem.vue';

let isLoading = ref(false); // 是否加载中
let imageClassPage = ref(1);
let imageClassLimit = ref(8);
let imageClassTotal = ref(0);
let imageClassList = ref([]); // 图片分类列表数据
let activeImageClassId = ref(0); // 选中的图片分类 id
const { proxy } = getCurrentInstance();

/**
 * 获取图片分类列表
 */
const _getImageClassList = async (page = 1) => {
  isLoading.value = true;
  const param = { limit: imageClassLimit.value };
  try {
    const { data: imageClassData } = await proxy.$api.getImageClassListApi(page, param);
    imageClassTotal.value = imageClassData.total;
    imageClassList.value = imageClassData.list;
    // 默认选中第一个分类
    imageClassList.value[0] && changeImageClassId(imageClassList.value[0].id);
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.log(error);
  }
};

/**
 * 更换图片分类
 */
const changeImageClassId = imageClassId => {
  activeImageClassId.value = imageClassId;
};

_getImageClassList();
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
