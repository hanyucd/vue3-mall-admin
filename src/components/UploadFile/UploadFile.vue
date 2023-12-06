<template>
  <el-upload
    multiple
    name="img"
    drag
    :action="$api.uploadImageApi"
    :headers="{ token: $store.state.userModule.userToken }"
    :data="postData"
    :on-success="onUploadSuccessEvt"
    :on-error="onUploadErrorEvt"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">点击或拖拽上传图片</div>
    <template #tip>
      <div class="el-upload__tip">支持 jpg/png 文件.</div>
    </template>
  </el-upload>
</template>

<script setup>
import * as commonUtil from '@/common/utils';

defineProps({
  postData: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['uploadFileSucEvt']);

/**
 * 监听上传文件成功事件
 */
const onUploadSuccessEvt = (response, uploadFile, uploadFiles) => {
  emit('uploadFileSucEvt', { response, uploadFile, uploadFiles });
};

/**
 * 监听上传文件成功事件
 */
const onUploadErrorEvt = (error, uploadFile, uploadFiles) => {
  let msg = JSON.parse(error.message).msg || '上传失败';
  commonUtil.elNotify(msg, 'error');
  // console.log('错误:', error);
};
</script>

<style lang="scss" scoped>

</style>
