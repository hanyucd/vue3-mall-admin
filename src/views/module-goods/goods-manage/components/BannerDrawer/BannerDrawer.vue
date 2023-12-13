<template>
  <el-drawer v-model="isShowBannerDrawer" title="设置轮播图" size="40%" destroy-on-close :show-close="true">
    <el-form v-loading="isLoading" :model="bannerForm">
      <el-form-item>
        <ChooseImage v-model="bannerForm.banners" :limit="9" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="submitBtnLoading" @click="submitBannerUpdate">提交</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import ChooseImage from '@/components/ChooseImage/ChooseImage.vue';
import { ref, reactive, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();
const isShowBannerDrawer = ref(false); // 是否显示轮播图 drawer
const isLoading = ref(false);

const goodsId = ref(0); // 商品 id
const bannerForm = reactive({
  banners: []
});

const emit = defineEmits(['reloadDataEvt']);

/**
 * 打开 轮播图 drawer
 */
const openBannerDrawer = tableItem => {
  isLoading.value = true;
  tableItem.bannersLoading = true;
  goodsId.value = tableItem.id;

  proxy.$api.getGoodsDetailApi(goodsId.value).then(res => {
    console.log(res);
    
    bannerForm.banners = res.data.goodsBanner.map(v => v.url);
    isShowBannerDrawer.value = true;
  }).finally(() => {
    isLoading.value = false;
    tableItem.bannersLoading = false;
  });
};


const submitBtnLoading = ref(false);
/**
 * 提交轮播图更新
 */
const submitBannerUpdate = () => {
  submitBtnLoading.value = true;
  proxy.$api.updateGoodBannerApi(goodsId.value, { banners: bannerForm.banners }).then(res => {
    proxy.$commonUtil.elNotify(`设置轮播图成功`);
    isShowBannerDrawer.value = false;
    emit('reloadDataEvt');
  }).finally(() => {
    submitBtnLoading.value = false;
  });
};

defineExpose({
  openBannerDrawer
});
</script>

<style lang="scss" scoped>

</style>
