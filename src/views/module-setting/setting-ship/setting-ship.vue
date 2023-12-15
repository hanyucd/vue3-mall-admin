<template>
  <div v-loading="isLoading" class="bg-white p-4 rounded">
    <el-form :model="baseForm" label-width="160px">
      <el-form-item label="物流查询Key">
        <el-input v-model="baseForm.ship" style="max-width: 300px;" />
        <span class="text-sm pt-2 text-gray-400 w-full">用于查询物流信息，接口申请（仅供参考）</span>
      </el-form-item>
      <el-form-item class="mt-3">
        <el-button type="primary" @click="submitUpdateConfig">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

const isLoading = ref(false);
const baseForm = reactive({
  'ship': '...'
});


/**
 * 获取系统设置
 */
const getSysConfigData = () => {
  isLoading.value = true;
  proxy.$api.getSysConfigApi().then(res => {
    for (let key in baseForm) {
      baseForm[key] = res.data[key];
    }
  }).finally(() => {
    isLoading.value = false;
  });
};

getSysConfigData();

/**
 * 提交修改
 */
const submitUpdateConfig = () => {
  isLoading.value = true;
  proxy.$api.updateSysConfigApi(baseForm).then(res => {
    proxy.$commonUtil.elNotify(`修改成功`);
  }).finally(() => {
    isLoading.value = false;
  });
};
</script> 

<style lang="scss" scoped>

</style>
