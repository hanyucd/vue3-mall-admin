<template>
  <el-main v-loading="isLoading">
    <div class="content">
      <div v-for="(item, index) in imageList" :key="index">
        {{ item.url }}
      </div>
    </div>

    <div class="footer">
      <el-pagination
        v-model:page-size="imageListLimit"
        v-model:current-page="imageListPage"
        background
        layout="prev, pager, next"
        :total="imageListTotal"
        @current-change="onCurrentPaginationChangeEvt"
      />
    </div>
  </el-main>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';

const props = defineProps({
  // activeImageClassId: { type: Number, default: 0}
});

let isLoading = ref(false); // 是否加载中
let imageListPage = ref(1); // 图片 当前页码
let imageListLimit = ref(10); // 图片 一页数量
let imageListTotal = ref(0); // 图片 数量总数
let imageList = ref([]); // 图片 列表数据

// 选中的图片分类 id
let activeImageClassId = ref(0);

const { proxy } = getCurrentInstance();

/**
 * 获取图片列表
 */
const _getImageList = async (page = 1) => {
  isLoading.value = true;
  const imageClassId = activeImageClassId.value;
  const param = { limit: imageListLimit.value };

  try {
    const { data: imageData } = await proxy.$api.getImageListApi(imageClassId, page, param);
    console.log(imageData);

    imageListTotal.value = imageData.totalCount;
    imageList.value = imageData.list.map(item => { item.checked = false; return item; });

    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.log(error);
  }
};

/**
 * current-page 改变时触发
 */
 const onCurrentPaginationChangeEvt = page => _getImageList(page);

/**
 * 发起拉取图片列表
 */
const fetchImageList = imageClassId => {
  activeImageClassId.value = imageClassId;
  imageListPage.value = 1;
  _getImageList();
  console.log('图片内容', imageClassId);
};

defineExpose({
  fetchImageList
});
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
