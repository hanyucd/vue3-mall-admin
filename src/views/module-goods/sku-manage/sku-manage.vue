<template>
  <el-card shadow="never" class="border-0">
    <TableHeader btn-list="create, refresh, delete" @createEvt="openFormDrawer" @deleteEvt="handleBatchTableItemDelete" @refreshEvt="getTableData(tablePage)" />

    <!-- 表格数据 -->
    <el-table ref="tableRef" v-loading="tableIsLoading" :data="tableDataList" border stripe @selection-change="handleTableSelectionChangeEvt">
      <el-table-column type="selection" width="55" />

      <el-table-column prop="name" label="规格名称" align="center" />
      
      <el-table-column prop="default" label="规格值" align="center" />

      <el-table-column prop="order" label="排序" align="center" />

      <el-table-column label="状态" align="center">
        <template #default="{ row }">
          <el-switch :model-value="row.status" :active-value="1" :inactive-value="0" :loading="row.isLoading" @change="switchChange($event, row)" />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="260" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEditTableItem(scope.row)">修改</el-button>
          <el-popconfirm title="是否删除该规格?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleBatchTableItemDelete(scope.row)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="tablePage"
      v-model:page-size="tableLimit"
      class="mt-6 flex items-center justify-center"
      background
      layout="prev, pager, next" 
      :total="tableTotal"
      @current-change="onTableCurPaginationChangeEvt"
    />

    <!-- 表单Drawer -->
    <FormDrawer ref="formDrawerRef" :title="formDrawerTitle" destroy-on-close @formDrawerSubmitEvt="onFormDrawerSubmitEvt" @formDrawerCloseEvt="onFormDrawerCloseEvt">
      <el-form ref="formRef" :model="tableFormData" :rules="tableFormRules" label-width="80px" :inline="false" size="default">
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="tableFormData.name" placeholder="规格名称" />
        </el-form-item>

        <el-form-item label="排序" prop="order">
          <el-input-number v-model="tableFormData.order" :min="0" :max="10000" />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-switch v-model="tableFormData.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
        
        <el-form-item label="规格值" prop="default">
          <TagInput v-model="tableFormData.default" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import TableHeader from '@/components/TableHeader/TableHeader.vue';
import FormDrawer from '@/components/FormDrawer/FormDrawer.vue';
import TagInput from '@/components/TagInput/TagInput.vue';

import { ref, getCurrentInstance } from 'vue';
import * as useTableHook from '@/hooks/useTableHook';

const { proxy } = getCurrentInstance();

const {
  tableIsLoading,
  tablePage,
  tableLimit,
  tableTotal,
  tableDataList,
  tableRef,
  switchChange,
  getTableData,
  onTableCurPaginationChangeEvt,
  handleTableSelectionChangeEvt,
  handleBatchTableItemDelete
} = useTableHook.useBaseTableHook({
  getTableDataApi: proxy.$api.getSkuLisApi,
  updateStatusApi: proxy.$api.updateSkuStatusApi,
  batchDeleteApi: proxy.$api.batchDeleteSkuApi,
});

const {
  tableFormData,
  tableFormRules,
  formDrawerRef,
  formRef,
  formDrawerTitle,
  editTableItemId,
  openFormDrawer,
  onFormDrawerSubmitEvt,
  onFormDrawerCloseEvt,
  handleEditTableItem
} = useTableHook.useFormTableHook({
  formData: {
    name: '',
    default: '',
    status: 1,
    order: 1000,
  },
  formRules: {
    name: [ { required: true, message: '请填写规格名称', trigger: 'blur' } ],
    default: [ { required: true, message: '请添加规格值', trigger: 'blur' } ]
  },
  createApi: proxy.$api.createSkuApi,
  updateApi: proxy.$api.updateSkuApi,
  tablePage,
  getTableData,
});

getTableData();
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
