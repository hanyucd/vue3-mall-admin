<template>
  <el-drawer v-model="isShowExportDrawer" title="导出订单" size="40%" destroy-on-close :show-close="true" :before-close="closeExportDrawer">
    <el-form ref="excelFormRef" :model="excelForm" label-width="80px">
      <el-form-item label="订单类型">
        <el-select v-model="excelForm.tab" placeholder="订单类型">
          <el-option
            v-for="item in tabs"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="excelForm.times"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="submitBtnLoading" @click="submitExportOrder">导出</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { ref, reactive, watch, getCurrentInstance } from 'vue';

defineProps({
  tabs: Array
});

const { proxy } = getCurrentInstance();
const isShowExportDrawer = ref(false); // 是否显示导出 drawer

const excelForm = reactive({
  tab: 'all',
  times: '',
  starttime: '',
  endtime: ''
});

watch(() => excelForm.times,
  (newValue) => {
    if (!Array.isArray(newValue)) {
      excelForm.starttime =  '';
      excelForm.endtime =  '';
      return false;
    }
    excelForm.starttime = newValue[0] || '';
    excelForm.endtime = newValue[1] || '';
  }
);

/**
 * 打开导出 drawer
 */
const openExportDrawer = () => isShowExportDrawer.value = true;

/**
 * 关闭导出 drawer
 */
const closeExportDrawer = () => {
  excelForm.tab = 'all';
  excelForm.times = '';
  isShowExportDrawer.value = false;
};

const submitBtnLoading = ref(false);
/**
 * 提交导出
 */
const submitExportOrder = () => {
  submitBtnLoading.value = true;

  proxy.$api.exportOrderApi({ ...excelForm }).then(res => {
    console.log(res);

    // 创建一个临时的url指向blob对象
    let url = window.URL.createObjectURL(new Blob([res]));
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    let filename = Date.now() + '.xlsx';
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    // 释放这个临时的对象url
    window.URL.revokeObjectURL(url);
    
    proxy.$commonUtil.elNotify(`导出成功`);
  }).finally(() => {
    submitBtnLoading.value = false;
  });
};

defineExpose({
  openExportDrawer
});
</script>

<style lang="scss" scoped>

</style>
