<template>
  <FormDrawer ref="formDrawerRef" title="设置商品详情" size="50%" destroy-on-close @formDrawerSubmitEvt="onFormDrawerSubmitEvt" @formDrawerCloseEvt="onFormDrawerCloseEvt">
    <Editor v-model="detailForm.content" />
  </FormDrawer>
</template>

<script setup>
import FormDrawer from '@/components/FormDrawer/FormDrawer.vue';
import Editor from '@/components/Editor/Editor.vue';
import { ref, reactive, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

const goodsId = ref(0); // 商品 id
const detailForm = reactive({ content: '' });
const formDrawerRef = ref(null);

const emit = defineEmits(['reloadDataEvt']);

/**
 * 打开详情 drawer
 */
 const openDetailDrawer = tableItem => {
  tableItem.contentLoading = true;
  goodsId.value = tableItem.id;

  proxy.$api.getGoodsDetailApi(goodsId.value).then(res => {
    detailForm.content = res.data.content;
    formDrawerRef.value.openFormDrawer();
  }).finally(() => {
    tableItem.contentLoading = false;
  });
};

// 表单 drawer 提交事件
const onFormDrawerSubmitEvt = () => {
  formDrawerRef.value.showSubmitBtnLoading();
  
  proxy.$api.updateGoodsApi(goodsId.value, { content: detailForm.content }).then(res => {
    proxy.$commonUtil.elNotify('更新商品详情成功');
    formDrawerRef.value.closeFormDrawer();
    emit('reloadDataEvt');
  }).finally(() => {
    formDrawerRef.value.hideSubmitBtnLoading();
  });
};

// 监听表单 drawer 关闭事件
const onFormDrawerCloseEvt = () => {
  Object.assign(detailForm, { content: '' });
};

defineExpose({
  openDetailDrawer
});
</script>

<style lang="scss" scoped>

</style>
