<template>
  <el-main v-loading="isLoading">
    <div class="content">
      <template v-if="imageList.length">
        <el-row :gutter="10">
          <el-col v-for="(item, index) in imageList" :key="index" :span="6" class="mb-3">
            <el-card shadow="hover" :body-style="{ padding: '0' }" class="border-2" :class="{'border-red-500': item.checked}">
              <div class="relative flex">
                <el-image :src="item.url" fit="cover" :lazy="true" class="w-full h-[150px]" :preview-src-list="[item.url]" :initial-index="index" />
                <p class="img-title">{{ item.name }}</p>
              </div>
              <!-- 按钮组 -->
              <div class="flex items-center justify-center p-2">
                <!-- <el-checkbox v-if="showChecked" v-model="item.checked" @change="handleChooseChange(item)" /> -->
                <el-button type="primary" size="small" text @click="handleImageRenameEvt(item)">重命名</el-button>
                <el-popconfirm title="是否删除该图片?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleDelete(item.id)">
                  <template #reference>
                    <el-button type="primary" size="small" text>删除</el-button>
                  </template>
                </el-popconfirm>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </template>
      <div v-else class="w-full text-3xl mt-28 flex items-center justify-center text-gray-500">
        当前分类还没有图片，快上传吧！！！
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
import * as commonUtil from '@/common/utils';

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
};

/**
 * 图片重命名
 */
const handleImageRenameEvt = imageItem => {
  commonUtil.elMsgBoxPrompt('重命名', imageItem.name).then(res => {
    const newImageName = res.value; 
    const param = { name: newImageName };

    proxy.$api.updateImageNameApi(imageItem.id, param).then(_ => {
      commonUtil.elNotify('重命名成功');
      // 重新请求当页数据
      _getImageList(imageListPage.value);
    });
  });
};

defineExpose({
  fetchImageList
});
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
