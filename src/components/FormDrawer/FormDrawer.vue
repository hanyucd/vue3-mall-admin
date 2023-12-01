<template>
  <el-drawer v-model="isShowDrawer" :title="title" :destroy-on-close="destroyOnClose" @close="onElDrawerCloseEvt">
    <div class="form-drawer-body">
      <div class="form-drawer-main">
        <slot></slot>
      </div>

      <div class="form-drawer-footer">
        <el-button type="primary" size="large" class="w-[120px]" :loading="submitBtnLoading" @click="submitEvt">{{ confirmText }}</el-button>
        <el-button type="warning" size="large" class="w-[120px]" @click="closeFormDrawer">取 消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  title: String,
  size: { type: String, default: '40%' },
  confirmText: { type: String, default: '提交' },
  destroyOnClose: { type: Boolean, default: false }
});

const emit = defineEmits(['formDrawerSubmitEvt', 'formDrawerCloseEvt']);

const isShowDrawer = ref(false); // 是否显示 drawer
const submitBtnLoading = ref(false); // 提交按钮 loading

/**
 * 打开提交按钮状态
 */
const showSubmitBtnLoading = () => submitBtnLoading.value = true;
/**
 * 关闭提交按钮状态
 */
const hideSubmitBtnLoading = () => submitBtnLoading.value = false;

/**
 * 确定提交
 */
const submitEvt = () => emit('formDrawerSubmitEvt');

/**
 * 监听 el-drawer close 事件
 */
const onElDrawerCloseEvt = () => emit('formDrawerCloseEvt');
/**
 * 打开 drawer
 */
const openFormDrawer = () => isShowDrawer.value = true;

/**
 * 关闭 drawer
 */
 const closeFormDrawer = () => {
   isShowDrawer.value = false;
 };

//  向父级暴露一下方法
defineExpose({
  openFormDrawer,
  closeFormDrawer,
  showSubmitBtnLoading,
  hideSubmitBtnLoading
});
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
